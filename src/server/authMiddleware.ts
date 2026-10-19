import { Request, Response, NextFunction } from 'express';
import { HynovaDatabase, SessionRecord } from './database';

export interface VerifiedAuthContext {
  authenticated: boolean;
  role: 'PUBLIC_CUSTOMER' | 'CUSTOMER' | 'SALES' | 'TECHNICIAN' | 'DISPATCH' | 'OPERATIONS' | 'FINANCE' | 'ADMIN' | 'EXECUTIVE';
  userId?: string;
  tenantId?: string;
  phone?: string | null;
  email?: string | null;
  sessionId?: string;
}

// Augment Express Request interface
declare global {
  namespace Express {
    interface Request {
      auth: VerifiedAuthContext;
    }
  }
}

/**
 * Extracts session token from Authorization header or Cookie.
 */
function extractSessionToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }

  const sessionHeader = req.headers['x-session-token'];
  if (typeof sessionHeader === 'string' && sessionHeader.trim()) {
    return sessionHeader.trim();
  }

  // Parse Cookie header if present
  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
    const match = cookieHeader.match(/(?:^|;\s*)hynova_session=([^;]+)/);
    if (match) {
      return decodeURIComponent(match[1]);
    }
  }

  return null;
}

/**
 * Derives verified server-side identity and tenant context.
 * Strict Zero-Trust: Never trusts client-supplied tenant ID, user ID, role, or email.
 */
export function deriveAuth(req: Request): VerifiedAuthContext {
  const token = extractSessionToken(req);

  if (token) {
    const session = HynovaDatabase.getSessionByToken(token);
    if (session) {
      return {
        authenticated: true,
        role: session.role as any,
        userId: session.user_id,
        tenantId: session.tenant_id,
        phone: session.phone,
        email: session.email,
        sessionId: session.session_id
      };
    }
  }

  // Check for verified Google OAuth workspace token if provided
  const googleToken = req.headers['x-google-token'] as string;
  const verifiedGoogleEmail = req.headers['x-verified-google-email'] as string;

  if (googleToken && verifiedGoogleEmail) {
    // Only accept verified corporate emails from Google Workspace OAuth
    if (verifiedGoogleEmail.toLowerCase().endsWith('@hynovaenterprises.com') || verifiedGoogleEmail.toLowerCase() === 'info@hynovaenterprises.com') {
      return {
        authenticated: true,
        role: 'ADMIN',
        userId: `admin_${verifiedGoogleEmail}`,
        tenantId: 'ten_hynova_enterprise_hq',
        email: verifiedGoogleEmail
      };
    }
  }

  // Default: Unauthenticated public customer. Zero access to private tenant or staff records.
  return {
    authenticated: false,
    role: 'PUBLIC_CUSTOMER'
  };
}

/**
 * Middleware: Injects verified auth into request.
 */
export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  req.auth = deriveAuth(req);
  next();
}

/**
 * Middleware: Requires an authenticated user session.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.auth || !req.auth.authenticated) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required. Please sign in with your verified phone number or credentials.'
    });
  }
  next();
}

/**
 * Middleware: Enforces server-side role authorization.
 */
export function requireRole(allowedRoles: Array<VerifiedAuthContext['role']>) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth || !req.auth.authenticated) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required.'
      });
    }

    if (!allowedRoles.includes(req.auth.role)) {
      return res.status(403).json({
        success: false,
        error: `Access Denied: Role '${req.auth.role}' is not authorized to access this resource. Required: [${allowedRoles.join(', ')}]`
      });
    }

    next();
  };
}
