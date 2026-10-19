import { HynovaDatabase } from './database';
import { sendPhoneOtp, verifyPhoneOtp, normalizeE164, getAvailableSmsProvider } from './phoneVerification';
import { Router, Request, Response } from 'express';
import { 
  serverSheetsStore, 
  checkSheetAccess, 
  extractAuth, 
  SPREADSHEET_ID, 
  SPREADSHEET_NAME,
  HynovaOpsRole,
  SheetCustomer,
  SheetSiteSurvey,
  SheetJob,
  SheetQuote,
  SheetDispatch,
  SheetSignoff,
  SheetTechnicianPayment
} from './sheetsOperations';

const router = Router();

// ============================================================================
// REAL PHONE OTP AUTHENTICATION & MULTI-TENANT SESSION ENDPOINTS
// ============================================================================

// POST /api/sheets/auth/phone/send-otp
router.post('/auth/phone/send-otp', async (req: Request, res: Response) => {
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ success: false, error: 'Phone number is required.' });
  }

  const result = await sendPhoneOtp(phone);
  if (!result.success) {
    const statusCode = result.status === 'COOLDOWN' ? 429 : result.status === 'BLOCKED' ? 503 : 400;
    return res.status(statusCode).json(result);
  }
  return res.json(result);
});

// POST /api/sheets/auth/phone/verify-otp
router.post('/auth/phone/verify-otp', async (req: Request, res: Response) => {
  const { phone, code } = req.body;
  if (!phone || !code) {
    return res.status(400).json({ success: false, error: 'Phone number and verification code are required.' });
  }

  const result = await verifyPhoneOtp(phone, code);
  if (!result.success) {
    const statusCode = (result.status === 'EXHAUSTED' || result.status === 'EXPIRED') ? 410 : 400;
    return res.status(statusCode).json(result);
  }

  // Set secure HttpOnly session cookie
  res.cookie('hynova_session', result.sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/'
  });

  return res.json(result);
});

// GET /api/sheets/auth/me
router.get('/auth/me', (req: Request, res: Response) => {
  const auth = extractAuth(req);
  if (!auth.authenticated) {
    return res.json({
      authenticated: false,
      role: 'PUBLIC_CUSTOMER'
    });
  }

  return res.json({
    authenticated: true,
    userId: auth.userId,
    tenantId: auth.tenantId,
    role: auth.role,
    phone: (auth as any).phone || null,
    email: auth.email || null
  });
});

// POST /api/sheets/auth/logout
router.post('/auth/logout', (req: Request, res: Response) => {
  const auth = extractAuth(req);
  if (auth.token) {
    HynovaDatabase.deleteSessionByToken(auth.token);
  }
  res.clearCookie('hynova_session', { path: '/' });
  return res.json({ success: true, message: 'Logged out successfully.' });
});

// ============================================================================
// MULTI-TENANT ISOLATED CUSTOMER DATA ENDPOINTS (STRICT OWNERSHIP ENFORCED)
// ============================================================================

// GET /api/sheets/customer/quotes — Read only quotes belonging to caller's tenant
router.get('/customer/quotes', (req: Request, res: Response) => {
  const auth = extractAuth(req);
  if (!auth.authenticated || !auth.tenantId) {
    return res.status(401).json({ success: false, error: 'Authentication required. Please sign in.' });
  }

  const quotes = HynovaDatabase.getQuotesByTenant(auth.tenantId);
  return res.json({
    success: true,
    tenantId: auth.tenantId,
    count: quotes.length,
    quotes
  });
});

// GET /api/sheets/customer/quotes/:quoteRef — Read single quote with tenant ownership enforcement
router.get('/customer/quotes/:quoteRef', (req: Request, res: Response) => {
  const auth = extractAuth(req);
  if (!auth.authenticated || !auth.tenantId) {
    return res.status(401).json({ success: false, error: 'Authentication required.' });
  }

  const { quoteRef } = req.params;
  const quote = HynovaDatabase.getQuoteByTenantAndRef(auth.tenantId, quoteRef);
  if (!quote) {
    // Check if quote exists for another tenant to prevent IDOR
    const otherTenantQuote = HynovaDatabase.db.prepare('SELECT tenant_id FROM quotes WHERE quote_ref = ?').get(quoteRef) as any;
    if (otherTenantQuote) {
      return res.status(403).json({
        success: false,
        error: 'Access Denied: You do not have permission to view this customer record.'
      });
    }
    return res.status(404).json({ success: false, error: `Quote '${quoteRef}' not found.` });
  }

  return res.json({ success: true, quote });
});

// PATCH /api/sheets/customer/quotes/:quoteRef/status — Update status of caller's quote only
router.patch('/customer/quotes/:quoteRef/status', (req: Request, res: Response) => {
  const auth = extractAuth(req);
  if (!auth.authenticated || !auth.tenantId) {
    return res.status(401).json({ success: false, error: 'Authentication required.' });
  }

  const { quoteRef } = req.params;
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ success: false, error: 'Status is required.' });
  }

  const quote = HynovaDatabase.getQuoteByTenantAndRef(auth.tenantId, quoteRef);
  if (!quote) {
    return res.status(403).json({
      success: false,
      error: 'Access Denied: You cannot modify a quote that does not belong to your account.'
    });
  }

  const updated = HynovaDatabase.updateQuoteStatus(auth.tenantId, quoteRef, status);
  return res.json({ success: updated, quoteRef, status });
});

// GET /api/sheets/customer/orders — Read only orders belonging to caller's tenant
router.get('/customer/orders', (req: Request, res: Response) => {
  const auth = extractAuth(req);
  if (!auth.authenticated || !auth.tenantId) {
    return res.status(401).json({ success: false, error: 'Authentication required.' });
  }

  const orders = HynovaDatabase.getOrdersByTenant(auth.tenantId);
  return res.json({ success: true, tenantId: auth.tenantId, orders });
});

// GET /api/sheets/customer/addresses — Read saved addresses
router.get('/customer/addresses', (req: Request, res: Response) => {
  const auth = extractAuth(req);
  if (!auth.authenticated || !auth.tenantId) {
    return res.status(401).json({ success: false, error: 'Authentication required.' });
  }

  const addresses = HynovaDatabase.getAddressesByTenant(auth.tenantId);
  return res.json({ success: true, tenantId: auth.tenantId, addresses });
});

// POST /api/sheets/customer/addresses — Save address to tenant account
router.post('/customer/addresses', (req: Request, res: Response) => {
  const auth = extractAuth(req);
  if (!auth.authenticated || !auth.tenantId) {
    return res.status(401).json({ success: false, error: 'Authentication required.' });
  }

  const { label, county, estateOrLandmark } = req.body;
  if (!label || !county || !estateOrLandmark) {
    return res.status(400).json({ success: false, error: 'label, county, and estateOrLandmark are required.' });
  }

  const address = HynovaDatabase.saveAddress(auth.tenantId, auth.userId || 'usr_unknown', label, county, estateOrLandmark);
  return res.json({ success: true, address });
});

// GET /api/sheets/customer/support — Read support tickets
router.get('/customer/support', (req: Request, res: Response) => {
  const auth = extractAuth(req);
  if (!auth.authenticated || !auth.tenantId) {
    return res.status(401).json({ success: false, error: 'Authentication required.' });
  }

  const tickets = HynovaDatabase.getSupportTicketsByTenant(auth.tenantId);
  return res.json({ success: true, tenantId: auth.tenantId, tickets });
});

// POST /api/sheets/customer/support — Create support ticket
router.post('/customer/support', (req: Request, res: Response) => {
  const auth = extractAuth(req);
  if (!auth.authenticated || !auth.tenantId) {
    return res.status(401).json({ success: false, error: 'Authentication required.' });
  }

  const { subject, message } = req.body;
  if (!subject || !message) {
    return res.status(400).json({ success: false, error: 'subject and message are required.' });
  }

  const ticket = HynovaDatabase.saveSupportTicket(auth.tenantId, auth.userId || 'usr_unknown', subject, message);
  return res.json({ success: true, ticket });
});


// 1. GET METADATA
router.get('/metadata', (req: Request, res: Response) => {
  const { role } = extractAuth(req);
  return res.json({
    success: true,
    spreadsheetId: SPREADSHEET_ID,
    spreadsheetName: SPREADSHEET_NAME,
    isConnectedToGoogle: serverSheetsStore.isConnectedToGoogle,
    lastSynced: serverSheetsStore.lastSynced,
    worksheetsCount: 18,
    callerRole: role
  });
});

// 2. GET ALL WORKSHEETS (FILTERED BY CALLER ROLE & STRICT MULTI-TENANT ISOLATION)
router.get('/worksheets', (req: Request, res: Response) => {
  const { role, email } = extractAuth(req);

  const payload: Record<string, any> = {
    controlPanel: serverSheetsStore.controlPanel,
    products: serverSheetsStore.products,
    services: serverSheetsStore.services
  };

  // Privileged Staff Roles: Can see global operational data
  const isPrivilegedStaff = ['SALES', 'DISPATCH', 'OPERATIONS', 'FINANCE', 'ADMIN', 'EXECUTIVE'].includes(role);

  if (isPrivilegedStaff) {
    if (checkSheetAccess(role, 'Customers', 'read')) payload.customers = serverSheetsStore.customers;
    if (checkSheetAccess(role, 'Jobs', 'read')) payload.jobs = serverSheetsStore.jobs;
    if (checkSheetAccess(role, 'Site_Surveys', 'read')) payload.siteSurveys = serverSheetsStore.siteSurveys;
    if (checkSheetAccess(role, 'Labour_Engine', 'read')) payload.labourEngine = serverSheetsStore.labourEngine;
    if (checkSheetAccess(role, 'Technicians', 'read')) payload.technicians = serverSheetsStore.technicians;
    if (checkSheetAccess(role, 'Quote_Estimator', 'read')) payload.quotes = serverSheetsStore.quotes;
    if (checkSheetAccess(role, 'Dispatch', 'read')) payload.dispatches = serverSheetsStore.dispatches;
    if (checkSheetAccess(role, 'Orders', 'read')) payload.orders = serverSheetsStore.orders;
    if (checkSheetAccess(role, 'Proof_And_Signoff', 'read')) payload.signoffs = serverSheetsStore.signoffs;
    if (checkSheetAccess(role, 'Technician_Payments', 'read')) payload.payments = serverSheetsStore.payments;
    if (checkSheetAccess(role, 'Maintenance', 'read')) payload.maintenance = serverSheetsStore.maintenance;
    if (checkSheetAccess(role, 'Warranty', 'read')) payload.warranties = serverSheetsStore.warranties;
    if (checkSheetAccess(role, 'Support', 'read')) payload.support = serverSheetsStore.support;
  } else if (role === 'CUSTOMER' && email) {
    // Strict Multi-Tenant Isolation for Authenticated Customers:
    // A customer can ONLY see records associated with their own identity.
    const userEmailLower = email.toLowerCase();
    const myCustomer = serverSheetsStore.customers.find(c => 
      (c.purchaserEmail && c.purchaserEmail.toLowerCase() === userEmailLower) ||
      (c.purchaserName && userEmailLower.includes(c.purchaserName.toLowerCase()))
    );

    const myCustId = myCustomer?.customerId;
    const myName = myCustomer?.purchaserName;

    payload.customers = myCustomer ? [myCustomer] : [];
    payload.jobs = myCustId ? serverSheetsStore.jobs.filter(j => j.customerId === myCustId) : [];
    payload.siteSurveys = myCustId ? serverSheetsStore.siteSurveys.filter(s => s.customerId === myCustId) : [];
    payload.quotes = myName ? serverSheetsStore.quotes.filter(q => q.purchaserName.toLowerCase() === myName.toLowerCase()) : [];
    payload.orders = myCustId ? serverSheetsStore.orders.filter(o => o.customerId === myCustId) : [];
    payload.warranties = myCustId ? serverSheetsStore.warranties.filter(w => w.customerId === myCustId) : [];
    payload.support = myCustId ? serverSheetsStore.support.filter(s => s.customerId === myCustId) : [];
    // Technicians, Dispatch, Payments, Internal Labour Engine are NEVER exposed to customers
  }
  // Public customers (PUBLIC_CUSTOMER) only receive controlPanel, products, and services

  return res.json({
    success: true,
    callerRole: role,
    data: payload
  });
});

// 3. READ SPECIFIC WORKSHEET WITH ROLE ENFORCEMENT & MULTI-TENANT ISOLATION
router.get('/read/:sheetName', (req: Request, res: Response) => {
  const { sheetName } = req.params;
  const { role, email } = extractAuth(req);

  if (!checkSheetAccess(role, sheetName, 'read')) {
    return res.status(403).json({
      success: false,
      error: `Access Denied: Role '${role}' is not authorized to read worksheet '${sheetName}'.`
    });
  }

  const sheetKeyMap: Record<string, keyof typeof serverSheetsStore> = {
    Control_Panel: 'controlPanel',
    Product_Catalog: 'products',
    Services: 'services',
    Customers: 'customers',
    Jobs: 'jobs',
    Site_Surveys: 'siteSurveys',
    Labour_Engine: 'labourEngine',
    Technicians: 'technicians',
    Quote_Estimator: 'quotes',
    Dispatch: 'dispatches',
    Orders: 'orders',
    Proof_And_Signoff: 'signoffs',
    Technician_Payments: 'payments',
    Maintenance: 'maintenance',
    Warranty: 'warranties',
    Support: 'support'
  };

  const storeKey = sheetKeyMap[sheetName];
  if (!storeKey || !(storeKey in serverSheetsStore)) {
    return res.status(404).json({ success: false, error: `Worksheet '${sheetName}' not found in HYNOVA OPS register.` });
  }

  let rawData = (serverSheetsStore as any)[storeKey];

  // If customer role, filter data to protect multi-tenant privacy
  if (role === 'CUSTOMER' && Array.isArray(rawData)) {
    const userEmailLower = (email || '').toLowerCase();
    const myCustomer = serverSheetsStore.customers.find(c => 
      (c.purchaserEmail && c.purchaserEmail.toLowerCase() === userEmailLower) ||
      (c.purchaserName && userEmailLower.includes(c.purchaserName.toLowerCase()))
    );
    const myCustId = myCustomer?.customerId;
    const myName = myCustomer?.purchaserName;

    if (sheetName === 'Customers') {
      rawData = myCustomer ? [myCustomer] : [];
    } else if (sheetName === 'Jobs') {
      rawData = myCustId ? rawData.filter((j: any) => j.customerId === myCustId) : [];
    } else if (sheetName === 'Site_Surveys') {
      rawData = myCustId ? rawData.filter((s: any) => s.customerId === myCustId) : [];
    } else if (sheetName === 'Quote_Estimator') {
      rawData = myName ? rawData.filter((q: any) => q.purchaserName.toLowerCase() === myName.toLowerCase()) : [];
    } else if (sheetName === 'Orders') {
      rawData = myCustId ? rawData.filter((o: any) => o.customerId === myCustId) : [];
    } else if (sheetName === 'Warranty') {
      rawData = myCustId ? rawData.filter((w: any) => w.customerId === myCustId) : [];
    } else if (sheetName === 'Support') {
      rawData = myCustId ? rawData.filter((s: any) => s.customerId === myCustId) : [];
    }
  }

  return res.json({
    success: true,
    sheetName,
    data: rawData
  });
});

// 4. SYNC WITH GOOGLE SHEETS API V4
router.post('/sync', async (req: Request, res: Response) => {
  const { token } = extractAuth(req);
  const result = await serverSheetsStore.syncWithGoogleSheets(token);
  return res.json({
    success: result.success,
    message: result.message,
    isConnectedToGoogle: serverSheetsStore.isConnectedToGoogle,
    lastSynced: serverSheetsStore.lastSynced
  });
});

// 5. AUTHORIZED CUSTOMER OPERATION: REGISTER CUSTOMER
router.post('/customer/register', async (req: Request, res: Response) => {
  const { purchaserName, purchaserPhone, purchaserEmail, installationRecipient, installationLocation, propertyType } = req.body;

  if (!purchaserName) {
    return res.status(400).json({ success: false, error: 'Purchaser Name is required.' });
  }

  const newCustomer: SheetCustomer = {
    customerId: serverSheetsStore.getNextCustomerId(),
    purchaserName: purchaserName.trim(),
    purchaserPhone: purchaserPhone || '',
    purchaserEmail: purchaserEmail || '',
    installationRecipient: (installationRecipient || purchaserName).trim(),
    installationLocation: installationLocation || 'Kenya',
    propertyType: propertyType || 'Residential Villa / Bungalow',
    createdDate: new Date().toISOString().split('T')[0]
  };

  serverSheetsStore.customers.unshift(newCustomer);

  // Sync to Google Sheet asynchronously
  const { token } = extractAuth(req);
  await serverSheetsStore.serverAppendToGoogleSheet(
    'Customers',
    [
      newCustomer.customerId,
      newCustomer.purchaserName,
      newCustomer.purchaserPhone,
      newCustomer.purchaserEmail,
      newCustomer.installationRecipient,
      newCustomer.installationLocation,
      newCustomer.propertyType,
      newCustomer.createdDate
    ],
    token
  );

  return res.json({
    success: true,
    message: `Customer ${newCustomer.customerId} registered successfully in HYNOVA OPS.`,
    customer: newCustomer
  });
});

// 6. AUTHORIZED CUSTOMER OPERATION: BOOK SITE SURVEY
router.post('/site-survey/book', async (req: Request, res: Response) => {
  const { customerId, siteLocation, distanceKm, siteComplexity, assessingTechnician, engineeringFindingsSummary, associatedJobId } = req.body;

  if (!customerId || !siteLocation) {
    return res.status(400).json({ success: false, error: 'Customer ID and Site Location are required to book a site survey.' });
  }

  const newSurvey: SheetSiteSurvey = {
    surveyId: serverSheetsStore.getNextSurveyId(),
    customerId,
    siteLocation,
    distanceKm: Number(distanceKm) || 15,
    siteComplexity: siteComplexity || 'Low (Single-Story Standard)',
    surveyFeeKES: serverSheetsStore.controlPanel.baseSiteSurveyFee,
    assessingTechnician: assessingTechnician || 'HYNOVA Field Engineer Team',
    surveyStatus: 'Submitted & Awaiting Site Visit',
    engineeringFindingsSummary: engineeringFindingsSummary || 'Customer requested on-site verification and Bill of Quantities sizing.',
    associatedJobId: associatedJobId || 'Pending'
  };

  serverSheetsStore.siteSurveys.unshift(newSurvey);

  const { token } = extractAuth(req);
  await serverSheetsStore.serverAppendToGoogleSheet(
    'Site_Surveys',
    [
      newSurvey.surveyId,
      newSurvey.customerId,
      newSurvey.siteLocation,
      newSurvey.distanceKm,
      newSurvey.siteComplexity,
      newSurvey.surveyFeeKES,
      newSurvey.assessingTechnician,
      newSurvey.surveyStatus,
      newSurvey.engineeringFindingsSummary,
      newSurvey.associatedJobId
    ],
    token
  );

  return res.json({
    success: true,
    message: `Site survey ${newSurvey.surveyId} logged in HYNOVA OPS.`,
    survey: newSurvey
  });
});

// 7. AUTHORIZED OPERATION: CREATE QUOTE
router.post('/quote/create', async (req: Request, res: Response) => {
  const { purchaserName, projectScope, hardwareSubtotalKES, labourKES, terms, phone, email } = req.body;

  if (!purchaserName || !projectScope) {
    return res.status(400).json({ success: false, error: 'Purchaser Name and Project Scope are required.' });
  }

  const hw = Number(hardwareSubtotalKES) || 0;
  const lb = Number(labourKES) || 0;
  const subtotal = hw + lb;
  const vat = Math.round(subtotal * serverSheetsStore.controlPanel.standardVatRate);
  const grandTotal = subtotal + vat;

  if (grandTotal < 5000) {
    return res.status(400).json({
      success: false,
      error: 'The minimum permitted project budget is KES 5,000. Please enter a project budget of at least KES 5,000.',
      minBudgetKES: 5000
    });
  }

  const auth = extractAuth(req);
  let tenantId = auth.tenantId;
  let userId = auth.userId || 'usr_guest';

  if (!tenantId) {
    // For guest quotes, securely allocate a persistent tenant ID linked to their phone or identity
    const customerPhone = phone || (email ? '+2547' + Math.floor(10000000 + Math.random() * 89999999) : '+2547' + Math.floor(10000000 + Math.random() * 89999999));
    const tenant = HynovaDatabase.getOrCreateTenantForPhone(customerPhone, purchaserName, email);
    tenantId = tenant.tenant_id;
    userId = tenant.user_id;
  }

  const quoteRef = serverSheetsStore.getNextQuoteRef();
  const newQuote: SheetQuote = {
    quoteRef,
    purchaserName,
    quoteDate: new Date().toISOString().split('T')[0],
    salesRep: 'HYNOVA AI Operations Desk',
    projectScope,
    validity: '30 Days',
    terms: terms || 'Milestone Escrow: 40% Mobilization, 40% Delivery, 20% Signoff',
    hardwareSubtotalKES: hw,
    labourKES: lb,
    vatKES: vat,
    grandTotalKES: grandTotal,
    status: 'Active Quote'
  };

  // Persist into durable SQLite storage
  HynovaDatabase.saveQuote(tenantId, userId, {
    quoteRef,
    purchaserName,
    projectScope,
    hardwareSubtotalKES: hw,
    labourKES: lb,
    vatKES: vat,
    grandTotalKES: grandTotal,
    status: 'Active Quote',
    rawJson: req.body
  });

  serverSheetsStore.quotes.unshift({ ...newQuote, tenantId } as any);

  await serverSheetsStore.serverAppendToGoogleSheet(
    'Quote_Estimator',
    [
      newQuote.quoteRef,
      newQuote.purchaserName,
      newQuote.quoteDate,
      newQuote.salesRep,
      newQuote.projectScope,
      newQuote.validity,
      newQuote.terms,
      newQuote.hardwareSubtotalKES,
      newQuote.labourKES,
      newQuote.vatKES,
      newQuote.grandTotalKES,
      newQuote.status
    ],
    auth.token
  );

  return res.json({
    success: true,
    message: `Quote ${newQuote.quoteRef} created in HYNOVA OPS.`,
    quote: {
      ...newQuote,
      tenantId
    }
  });
});
// 8. PRIVILEGED STAFF OPERATION: CREATE JOB (REQUIRES OPERATIONS / SALES / ADMIN)
router.post('/job/create', async (req: Request, res: Response) => {
  const { role, token } = extractAuth(req);

  if (!['SALES', 'OPERATIONS', 'ADMIN', 'EXECUTIVE'].includes(role)) {
    return res.status(403).json({
      success: false,
      error: `Access Denied: Role '${role}' is not authorized to create operational jobs.`
    });
  }

  const { customerId, serviceId, hardwareValueKES, labourValueKES, logisticsValueKES, surveyFeeKES, crewSize, estDays } = req.body;

  if (!customerId || !serviceId) {
    return res.status(400).json({ success: false, error: 'Customer ID and Service ID are required.' });
  }

  const logistics = Number(logisticsValueKES) || 3000;
  const survey = Number(surveyFeeKES) || serverSheetsStore.controlPanel.baseSiteSurveyFee;
  const hw = Number(hardwareValueKES) || 0;
  const lb = Number(labourValueKES) || 0;
  const subtotal = hw + lb + logistics + survey;
  const vat = Math.round(subtotal * serverSheetsStore.controlPanel.standardVatRate);
  const totalBilled = subtotal + vat;

  const newJob: SheetJob = {
    jobId: serverSheetsStore.getNextJobId(),
    customerId,
    serviceId,
    hardwareValueKES: hw,
    labourValueKES: lb,
    logisticsValueKES: logistics,
    surveyFeeKES: survey,
    subtotalExclVatKES: subtotal,
    vatAmountKES: vat,
    totalBilledKES: totalBilled,
    crewSize: Number(crewSize) || serverSheetsStore.controlPanel.standardBaselineTechnicians,
    estDays: Number(estDays) || 2,
    lifecycleStatus: 'Scheduled'
  };

  serverSheetsStore.jobs.unshift(newJob);

  await serverSheetsStore.serverAppendToGoogleSheet(
    'Jobs',
    [
      newJob.jobId,
      newJob.customerId,
      newJob.serviceId,
      newJob.hardwareValueKES,
      newJob.labourValueKES,
      newJob.logisticsValueKES,
      newJob.surveyFeeKES,
      newJob.subtotalExclVatKES,
      newJob.vatAmountKES,
      newJob.totalBilledKES,
      newJob.crewSize,
      newJob.estDays,
      newJob.lifecycleStatus
    ],
    token
  );

  return res.json({
    success: true,
    message: `Job ${newJob.jobId} created in HYNOVA OPS.`,
    job: newJob
  });
});

// 9. PRIVILEGED STAFF OPERATION: ASSIGN DISPATCH (STRICT PAYMENT-GATED)
router.post('/dispatch/assign', async (req: Request, res: Response) => {
  const { role, token } = extractAuth(req);

  if (!['DISPATCH', 'OPERATIONS', 'ADMIN', 'EXECUTIVE'].includes(role)) {
    return res.status(403).json({
      success: false,
      error: `Access Denied: Role '${role}' is not authorized to dispatch field engineers.`
    });
  }

  const { jobId, technicianId, scheduledDate, timeSlot, siteLocation, fieldNotes } = req.body;

  // Strict Payment-Gate: Verify payment before dispatch
  const relatedOrder = serverSheetsStore.orders.find(o => o.jobIdOrQuote === jobId || o.orderId === jobId);
  const isPaymentVerified = relatedOrder && ['Escrow Funded', 'Paid', 'Disbursed to Technician', 'Fully Settled'].includes(relatedOrder.paymentStatus);
  if (!isPaymentVerified) {
    return res.status(402).json({
      success: false,
      error: {
        code: 'PAYMENT_UNVERIFIED',
        message: `Payment has not been verified for Job '${jobId}'. Dispatch is strictly payment-gated.`
      }
    });
  }

  const nextNum = serverSheetsStore.dispatches.length + 1;
  const dispatchId = `HYN-DSP-${String(nextNum).padStart(4, '0')}`;

  const newDispatch: SheetDispatch = {
    dispatchId,
    jobId: jobId || 'HYN-JOB-0001',
    technicianId: technicianId || 'HYN-TECH-001',
    scheduledDate: scheduledDate || new Date().toISOString().split('T')[0],
    timeSlot: timeSlot || '09:00 AM - 05:00 PM',
    siteLocation: siteLocation || 'Nairobi, Kenya',
    status: 'Scheduled',
    fieldNotes: fieldNotes || 'Standard toolsets required.'
  };

  serverSheetsStore.dispatches.unshift(newDispatch);

  await serverSheetsStore.serverAppendToGoogleSheet(
    'Dispatch',
    [
      newDispatch.dispatchId,
      newDispatch.jobId,
      newDispatch.technicianId,
      newDispatch.scheduledDate,
      newDispatch.timeSlot,
      newDispatch.siteLocation,
      newDispatch.status,
      newDispatch.fieldNotes
    ],
    token
  );

  return res.json({
    success: true,
    message: `Dispatch ${newDispatch.dispatchId} scheduled.`,
    dispatch: newDispatch
  });
});

// 10. SUBMIT PROOF AND SIGNOFF
router.post('/signoff/submit', async (req: Request, res: Response) => {
  const { jobId, customerSignatory, otpConfirmed, photoUrl, checklistCompleted } = req.body;

  const newSignoff: SheetSignoff = {
    signoffId: serverSheetsStore.getNextSignoffId(),
    jobId: jobId || 'HYN-JOB-0001',
    customerSignatory: customerSignatory || 'Customer Representative',
    otpConfirmed: Boolean(otpConfirmed),
    photoUrl: photoUrl || '',
    checklistCompleted: Boolean(checklistCompleted),
    signoffDate: new Date().toISOString().split('T')[0],
    status: 'Signoff Complete & Verified'
  };

  serverSheetsStore.signoffs.unshift(newSignoff);

  const { token } = extractAuth(req);
  await serverSheetsStore.serverAppendToGoogleSheet(
    'Proof_And_Signoff',
    [
      newSignoff.signoffId,
      newSignoff.jobId,
      newSignoff.customerSignatory,
      newSignoff.otpConfirmed ? 'TRUE' : 'FALSE',
      newSignoff.photoUrl,
      newSignoff.checklistCompleted ? 'TRUE' : 'FALSE',
      newSignoff.signoffDate,
      newSignoff.status
    ],
    token
  );

  return res.json({
    success: true,
    message: `Signoff ${newSignoff.signoffId} registered.`,
    signoff: newSignoff
  });
});

// 11. PRIVILEGED STAFF OPERATION: TRIGGER TECHNICIAN PAYMENT (REQUIRES FINANCE / ADMIN)
router.post('/technician-payment/trigger', async (req: Request, res: Response) => {
  const { role, token } = extractAuth(req);

  if (!['FINANCE', 'ADMIN', 'EXECUTIVE'].includes(role)) {
    return res.status(403).json({
      success: false,
      error: `Access Denied: Role '${role}' is not authorized to trigger technician payouts.`
    });
  }

  const { jobId, technicianId, poolAmountKES, disbursementMethod, mpesaRef } = req.body;

  const newPayout: SheetTechnicianPayment = {
    payoutId: serverSheetsStore.getNextPayoutId(),
    jobId: jobId || 'HYN-JOB-0001',
    technicianId: technicianId || 'HYN-TECH-001',
    poolAmountKES: Number(poolAmountKES) || 12500,
    disbursementMethod: disbursementMethod || serverSheetsStore.controlPanel.defaultDisbursementMethod,
    mpesaRef: mpesaRef || `RKL${Math.floor(100000 + Math.random() * 900000)}X`,
    paymentTriggerSatisfied: true,
    status: 'Disbursed to Technician'
  };

  serverSheetsStore.payments.unshift(newPayout);

  await serverSheetsStore.serverAppendToGoogleSheet(
    'Technician_Payments',
    [
      newPayout.payoutId,
      newPayout.jobId,
      newPayout.technicianId,
      newPayout.poolAmountKES,
      newPayout.disbursementMethod,
      newPayout.mpesaRef,
      newPayout.paymentTriggerSatisfied ? 'TRUE' : 'FALSE',
      newPayout.status
    ],
    token
  );

  return res.json({
    success: true,
    message: `Payout ${newPayout.payoutId} triggered and logged in HYNOVA OPS.`,
    payout: newPayout
  });
});

// 12. UPDATE CONTROL PANEL CONFIGURATION (ADMIN / EXECUTIVE ONLY)
router.post('/control-panel/update', (req: Request, res: Response) => {
  const { role } = extractAuth(req);

  if (!['ADMIN', 'EXECUTIVE'].includes(role)) {
    return res.status(403).json({
      success: false,
      error: `Access Denied: Role '${role}' is not authorized to modify Control_Panel parameters.`
    });
  }

  const updates = req.body;
  Object.assign(serverSheetsStore.controlPanel, updates);

  return res.json({
    success: true,
    message: 'Control_Panel updated successfully.',
    controlPanel: serverSheetsStore.controlPanel
  });
});

// 13. PRIVILEGED DIRECT APPEND (STAFF/ADMIN ONLY WITH STRICT ROLE VALIDATION)
router.post('/privileged/append-row', async (req: Request, res: Response) => {
  const { role, token } = extractAuth(req);
  const { sheetName, rowValues } = req.body;

  if (!sheetName || !Array.isArray(rowValues)) {
    return res.status(400).json({ success: false, error: 'sheetName and rowValues array are required.' });
  }

  // Strict RBAC check - customers are never allowed
  if (!checkSheetAccess(role, sheetName, 'write')) {
    return res.status(403).json({
      success: false,
      error: `Access Denied: Role '${role}' is not authorized to write directly to sheet '${sheetName}'.`
    });
  }

  const success = await serverSheetsStore.serverAppendToGoogleSheet(sheetName, rowValues, token);

  return res.json({
    success: true,
    message: `Row successfully appended to sheet '${sheetName}' via secure HYNOVA backend API.`,
    syncedToGoogleApi: success
  });
});

// ============================================================================
// SECTION 14 & 15: HYNOVA TECHNICIAN REGISTRY — AUTHORITATIVE ENDPOINTS
// ============================================================================

// GET /api/technicians — Count and list actual records from Technicians worksheet
// GET /api/technicians — Count and list actual records from Technicians worksheet (Staff Protected)
router.get('/technicians', (req: Request, res: Response) => {
  const auth = extractAuth(req);
  const isPrivilegedStaff = ['SALES', 'DISPATCH', 'OPERATIONS', 'FINANCE', 'ADMIN', 'EXECUTIVE'].includes(auth.role) && auth.authenticated;
  if (!isPrivilegedStaff) {
    return res.status(403).json({
      success: false,
      error: `Access Denied: Role '${auth.role}' is not authorized to view internal technician records.`
    });
  }
  const techs = serverSheetsStore.getTechnicians();
  return res.json({
    success: true,
    count: techs.length,
    technicians: techs
  });
});

// GET /api/technicians/available — Count and list active & available technicians (Staff Protected)
router.get('/technicians/available', (req: Request, res: Response) => {
  const auth = extractAuth(req);
  const isPrivilegedStaff = ['SALES', 'DISPATCH', 'OPERATIONS', 'FINANCE', 'ADMIN', 'EXECUTIVE'].includes(auth.role) && auth.authenticated;
  if (!isPrivilegedStaff) {
    return res.status(403).json({
      success: false,
      error: `Access Denied: Role '${auth.role}' is not authorized to view available technicians.`
    });
  }
  const availableTechs = serverSheetsStore.getAvailableTechnicians();
  return res.json({
    success: true,
    count: availableTechs.length,
    technicians: availableTechs
  });
});

// GET /api/technicians/by-county/:county — Filter actual technicians by county (Staff Protected)
router.get('/technicians/by-county/:county', (req: Request, res: Response) => {
  const auth = extractAuth(req);
  const isPrivilegedStaff = ['SALES', 'DISPATCH', 'OPERATIONS', 'FINANCE', 'ADMIN', 'EXECUTIVE'].includes(auth.role) && auth.authenticated;
  if (!isPrivilegedStaff) {
    return res.status(403).json({
      success: false,
      error: `Access Denied: Role '${auth.role}' is not authorized to view technicians.`
    });
  }
  const { county } = req.params;
  const countyTechs = serverSheetsStore.getTechniciansByCounty(county);
  return res.json({
    success: true,
    count: countyTechs.length,
    county,
    technicians: countyTechs
  });
});

// GET /api/technicians/by-skill/:skill — Filter actual technicians by skill (Staff Protected)
router.get('/technicians/by-skill/:skill', (req: Request, res: Response) => {
  const auth = extractAuth(req);
  const isPrivilegedStaff = ['SALES', 'DISPATCH', 'OPERATIONS', 'FINANCE', 'ADMIN', 'EXECUTIVE'].includes(auth.role) && auth.authenticated;
  if (!isPrivilegedStaff) {
    return res.status(403).json({
      success: false,
      error: `Access Denied: Role '${auth.role}' is not authorized to view technicians.`
    });
  }
  const { skill } = req.params;
  const skillTechs = serverSheetsStore.getTechniciansBySkill(skill);
  return res.json({
    success: true,
    count: skillTechs.length,
    skill,
    technicians: skillTechs
  });
});
// POST /api/technicians/create — Future technician additions by authorized Admin/Operations
router.post('/technicians/create', async (req: Request, res: Response) => {
  const { role, token } = extractAuth(req);

  if (!['OPERATIONS', 'ADMIN', 'EXECUTIVE'].includes(role)) {
    return res.status(403).json({
      success: false,
      error: `Access Denied: Role '${role}' is not authorized to onboard technicians to the registry.`
    });
  }

  const { fullName, phone, baseCounty, primarySkills, professionalCertification, hynovaTraining, paymentMethod, settlementAccount, status, availability } = req.body;

  if (!fullName || !phone || !baseCounty || !primarySkills) {
    return res.status(400).json({
      success: false,
      error: 'fullName, phone, baseCounty, and primarySkills are required to create a technician record.'
    });
  }

  const newTech = serverSheetsStore.addTechnician({
    fullName,
    phone,
    baseCounty,
    primarySkills,
    professionalCertification: professionalCertification || 'EPRA / NCA Certified',
    hynovaTraining: hynovaTraining || 'Completed',
    status: status || 'Active',
    paymentMethod: paymentMethod || 'M-Pesa B2C',
    settlementAccount: settlementAccount || phone,
    availability: availability || 'Available'
  });

  await serverSheetsStore.serverAppendToGoogleSheet(
    'Technicians',
    [
      newTech.technicianId,
      newTech.fullName,
      newTech.phone,
      newTech.baseCounty,
      newTech.primarySkills,
      newTech.professionalCertification,
      newTech.hynovaTraining,
      newTech.status,
      newTech.paymentMethod,
      newTech.settlementAccount,
      newTech.availability
    ],
    token
  );

  return res.json({
    success: true,
    message: `Technician ${newTech.technicianId} (${newTech.fullName}) successfully registered in Technicians worksheet.`,
    technician: newTech
  });
});

// POST /api/jobs/:jobId/assign-technician — Strict Assignment API
router.post('/jobs/:jobId/assign-technician', async (req: Request, res: Response) => {
  const { role, token } = extractAuth(req);
  const { jobId } = req.params;

  // 1. Verify authorization
  if (!['DISPATCH', 'OPERATIONS', 'ADMIN', 'EXECUTIVE'].includes(role)) {
    return res.status(403).json({
      success: false,
      error: `Access Denied: Role '${role}' is not authorized to assign technicians.`
    });
  }

  // Find job
  const job = serverSheetsStore.jobs.find(j => j.jobId === jobId);
  if (!job) {
    return res.status(404).json({
      success: false,
      error: `Job '${jobId}' not found.`
    });
  }

  // 2. Read actual Technicians worksheet & filter eligible
  const eligibleTechs = serverSheetsStore.getAvailableTechnicians();

  // 3. If zero eligible technicians: do not assign, return NO_ELIGIBLE_TECHNICIAN
  if (eligibleTechs.length === 0) {
    job.lifecycleStatus = 'Awaiting Technician Assignment';
    return res.status(422).json({
      success: false,
      error: {
        code: 'NO_ELIGIBLE_TECHNICIAN',
        message: 'No eligible HYNOVA technician is currently recorded as available.'
      },
      jobStatus: 'Awaiting Technician Assignment'
    });
  }

  // 4. Assign eligible technician
  const assigned = eligibleTechs[0];
  job.lifecycleStatus = 'Assigned';

  const dispatchNum = serverSheetsStore.dispatches.length + 1;
  const dispatchId = `HYN-DSP-${String(dispatchNum).padStart(4, '0')}`;
  const newDispatch: SheetDispatch = {
    dispatchId,
    jobId,
    technicianId: assigned.technicianId,
    scheduledDate: new Date().toISOString().split('T')[0],
    timeSlot: '09:00 AM - 05:00 PM',
    siteLocation: 'Customer Site Location',
    status: 'Scheduled',
    fieldNotes: 'Assigned to certified technician.'
  };
  serverSheetsStore.dispatches.unshift(newDispatch);

  await serverSheetsStore.serverAppendToGoogleSheet(
    'Dispatch',
    [
      newDispatch.dispatchId,
      newDispatch.jobId,
      newDispatch.technicianId,
      newDispatch.scheduledDate,
      newDispatch.timeSlot,
      newDispatch.siteLocation,
      newDispatch.status,
      newDispatch.fieldNotes
    ],
    token
  );

  return res.json({
    success: true,
    message: `Technician ${assigned.technicianId} (${assigned.fullName}) assigned to Job ${jobId}.`,
    assignedTechnician: assigned,
    dispatch: newDispatch
  });
});

export default router;
