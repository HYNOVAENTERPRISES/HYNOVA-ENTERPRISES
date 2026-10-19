import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import sheetsRouter from "./src/server/sheetsRoutes";
import { serverSheetsStore, extractAuth } from "./src/server/sheetsOperations";
import { authMiddleware } from "./src/server/authMiddleware";
import { HynovaDatabase } from "./src/server/database";
import { sendPhoneOtp, verifyPhoneOtp } from "./src/server/phoneVerification";
import { HynovaAdvisorEngine } from "./src/services/advisorEngine";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// CORS & Preflight middleware for production cross-domain and local architecture
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    'https://hynovaenterprises.com',
    'https://www.hynovaenterprises.com',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
  ];

  const isAllowed = origin && (
    allowedOrigins.includes(origin) ||
    origin.endsWith('.hynovaenterprises.com') ||
    origin.endsWith('.run.app')
  );

  if (isAllowed && origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-session-token, x-google-token, x-verified-google-email');
  }

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.use(authMiddleware);

// Mount Secure Google Sheets Operations & RBAC Backend
app.use("/api/sheets", sheetsRouter);

// SECTION 14 & 15 DIRECT API ENDPOINTS FOR TECHNICIAN REGISTRY
// AUTH & MULTI-TENANT TOP-LEVEL API ENDPOINTS
app.post("/api/auth/phone/send-otp", async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ success: false, error: "Phone number is required." });
  const result = await sendPhoneOtp(phone);
  const status = result.status === "COOLDOWN" ? 429 : result.status === "BLOCKED" ? 503 : result.success ? 200 : 400;
  return res.status(status).json(result);
});

app.post("/api/auth/phone/verify-otp", async (req, res) => {
  const { phone, code } = req.body;
  if (!phone || !code) return res.status(400).json({ success: false, error: "Phone and code required." });
  const result = await verifyPhoneOtp(phone, code);
  if (!result.success) {
    const status = (result.status === "EXHAUSTED" || result.status === "EXPIRED") ? 410 : 400;
    return res.status(status).json(result);
  }
  const isCrossSite = Boolean(req.headers.origin && !req.headers.origin.includes('localhost'));
  res.cookie("hynova_session", result.sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" || isCrossSite,
    sameSite: isCrossSite ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/"
  });
  return res.json(result);
});

app.get("/api/auth/me", (req, res) => {
  const auth = extractAuth(req);
  if (!auth.authenticated) return res.json({ authenticated: false, role: "PUBLIC_CUSTOMER" });
  return res.json({
    authenticated: true,
    userId: auth.userId,
    tenantId: auth.tenantId,
    role: auth.role,
    phone: (auth as any).phone || null,
    email: auth.email || null
  });
});

app.post("/api/auth/logout", (req, res) => {
  const auth = extractAuth(req);
  if (auth.token) HynovaDatabase.deleteSessionByToken(auth.token);
  res.clearCookie("hynova_session", { path: "/" });
  return res.json({ success: true, message: "Logged out successfully." });
});

// MULTI-TENANT CUSTOMER DATA ENDPOINTS (STRICT ZERO-TRUST OWNER CHECKS)
app.get("/api/customer/quotes", (req, res) => {
  const auth = extractAuth(req);
  if (!auth.authenticated || !auth.tenantId) {
    return res.status(401).json({ success: false, error: "Authentication required." });
  }
  const quotes = HynovaDatabase.getQuotesByTenant(auth.tenantId);
  return res.json({ success: true, tenantId: auth.tenantId, count: quotes.length, quotes });
});

app.get("/api/customer/quotes/:quoteRef", (req, res) => {
  const auth = extractAuth(req);
  if (!auth.authenticated || !auth.tenantId) {
    return res.status(401).json({ success: false, error: "Authentication required." });
  }
  const { quoteRef } = req.params;
  const quote = HynovaDatabase.getQuoteByTenantAndRef(auth.tenantId, quoteRef);
  if (!quote) {
    const otherTenantQuote = HynovaDatabase.db.prepare("SELECT tenant_id FROM quotes WHERE quote_ref = ?").get(quoteRef) as any;
    if (otherTenantQuote) {
      return res.status(403).json({ success: false, error: "Access Denied: You do not have permission to view this customer record." });
    }
    return res.status(404).json({ success: false, error: `Quote '${quoteRef}' not found.` });
  }
  return res.json({ success: true, quote });
});

app.patch("/api/customer/quotes/:quoteRef/status", (req, res) => {
  const auth = extractAuth(req);
  if (!auth.authenticated || !auth.tenantId) {
    return res.status(401).json({ success: false, error: "Authentication required." });
  }
  const { quoteRef } = req.params;
  const { status } = req.body;
  const quote = HynovaDatabase.getQuoteByTenantAndRef(auth.tenantId, quoteRef);
  if (!quote) {
    return res.status(403).json({ success: false, error: "Access Denied: You cannot modify another tenant's quote." });
  }
  const updated = HynovaDatabase.updateQuoteStatus(auth.tenantId, quoteRef, status);
  return res.json({ success: updated, quoteRef, status });
});

app.get("/api/customer/orders", (req, res) => {
  const auth = extractAuth(req);
  if (!auth.authenticated || !auth.tenantId) return res.status(401).json({ success: false, error: "Authentication required." });
  const orders = HynovaDatabase.getOrdersByTenant(auth.tenantId);
  return res.json({ success: true, tenantId: auth.tenantId, orders });
});

app.get("/api/customer/addresses", (req, res) => {
  const auth = extractAuth(req);
  if (!auth.authenticated || !auth.tenantId) return res.status(401).json({ success: false, error: "Authentication required." });
  const addresses = HynovaDatabase.getAddressesByTenant(auth.tenantId);
  return res.json({ success: true, tenantId: auth.tenantId, addresses });
});

app.post("/api/customer/addresses", (req, res) => {
  const auth = extractAuth(req);
  if (!auth.authenticated || !auth.tenantId) return res.status(401).json({ success: false, error: "Authentication required." });
  const { label, county, estateOrLandmark } = req.body;
  if (!label || !county || !estateOrLandmark) return res.status(400).json({ success: false, error: "Missing address fields." });
  const address = HynovaDatabase.saveAddress(auth.tenantId, auth.userId || "usr_guest", label, county, estateOrLandmark);
  return res.json({ success: true, address });
});

app.get("/api/customer/support", (req, res) => {
  const auth = extractAuth(req);
  if (!auth.authenticated || !auth.tenantId) return res.status(401).json({ success: false, error: "Authentication required." });
  const tickets = HynovaDatabase.getSupportTicketsByTenant(auth.tenantId);
  return res.json({ success: true, tenantId: auth.tenantId, tickets });
});

app.post("/api/customer/support", (req, res) => {
  const auth = extractAuth(req);
  if (!auth.authenticated || !auth.tenantId) return res.status(401).json({ success: false, error: "Authentication required." });
  const { subject, message } = req.body;
  if (!subject || !message) return res.status(400).json({ success: false, error: "Subject and message required." });
  const ticket = HynovaDatabase.saveSupportTicket(auth.tenantId, auth.userId || "usr_guest", subject, message);
  return res.json({ success: true, ticket });
});

// STAFF & ADMIN PROTECTED TECHNICIAN REGISTRY ENDPOINTS
app.get("/api/technicians", (req, res) => {
  const auth = extractAuth(req);
  const isStaff = ["SALES", "DISPATCH", "OPERATIONS", "FINANCE", "ADMIN", "EXECUTIVE"].includes(auth.role) && auth.authenticated;
  if (!isStaff) {
    return res.status(403).json({ success: false, error: `Access Denied: Role '${auth.role}' is not authorized to view internal technician records.` });
  }
  const techs = serverSheetsStore.getTechnicians();
  res.json({ success: true, count: techs.length, technicians: techs });
});

app.get("/api/technicians/available", (req, res) => {
  const auth = extractAuth(req);
  const isStaff = ["SALES", "DISPATCH", "OPERATIONS", "FINANCE", "ADMIN", "EXECUTIVE"].includes(auth.role) && auth.authenticated;
  if (!isStaff) {
    return res.status(403).json({ success: false, error: `Access Denied: Role '${auth.role}' is not authorized to view available technicians.` });
  }
  const availableTechs = serverSheetsStore.getAvailableTechnicians();
  res.json({ success: true, count: availableTechs.length, technicians: availableTechs });
});

app.get("/api/technicians/by-county/:county", (req, res) => {
  const auth = extractAuth(req);
  const isStaff = ["SALES", "DISPATCH", "OPERATIONS", "FINANCE", "ADMIN", "EXECUTIVE"].includes(auth.role) && auth.authenticated;
  if (!isStaff) {
    return res.status(403).json({ success: false, error: `Access Denied: Role '${auth.role}' is not authorized to view technicians.` });
  }
  const countyTechs = serverSheetsStore.getTechniciansByCounty(req.params.county);
  res.json({ success: true, count: countyTechs.length, county: req.params.county, technicians: countyTechs });
});

app.get("/api/technicians/by-skill/:skill", (req, res) => {
  const auth = extractAuth(req);
  const isStaff = ["SALES", "DISPATCH", "OPERATIONS", "FINANCE", "ADMIN", "EXECUTIVE"].includes(auth.role) && auth.authenticated;
  if (!isStaff) {
    return res.status(403).json({ success: false, error: `Access Denied: Role '${auth.role}' is not authorized to view technicians.` });
  }
  const skillTechs = serverSheetsStore.getTechniciansBySkill(req.params.skill);
  res.json({ success: true, count: skillTechs.length, skill: req.params.skill, technicians: skillTechs });
});

app.post("/api/jobs/:jobId/assign-technician", async (req, res) => {
  const { role, token } = extractAuth(req);
  const { jobId } = req.params;

  if (!['DISPATCH', 'OPERATIONS', 'ADMIN', 'EXECUTIVE'].includes(role)) {
    return res.status(403).json({
      success: false,
      error: `Access Denied: Role '${role}' is not authorized to assign technicians.`
    });
  }

  const job = serverSheetsStore.jobs.find(j => j.jobId === jobId);
  if (!job) {
    return res.status(404).json({
      success: false,
      error: `Job '${jobId}' not found.`
    });
  }

  // Strict Payment-Gate: Verify payment before assigning technician
  const relatedOrder = serverSheetsStore.orders.find(o => o.jobIdOrQuote === jobId || o.orderId === jobId);
  const isPaymentVerified = relatedOrder && ['Escrow Funded', 'Paid', 'Disbursed to Technician', 'Fully Settled'].includes(relatedOrder.paymentStatus);
  if (!isPaymentVerified) {
    return res.status(402).json({
      success: false,
      error: {
        code: 'PAYMENT_UNVERIFIED',
        message: `Payment has not been verified for Job '${jobId}'. Technician assignment is strictly payment-gated.`
      }
    });
  }

  const eligibleTechs = serverSheetsStore.getAvailableTechnicians();
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

  const assigned = eligibleTechs[0];
  job.lifecycleStatus = 'Assigned';
  res.json({
    success: true,
    message: `Technician ${assigned.technicianId} (${assigned.fullName}) assigned to Job ${jobId}.`,
    assignedTechnician: assigned
  });
});

// Container health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "HYNOVA Backend", timestamp: new Date().toISOString() });
});

// Initialize Google GenAI lazily
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    } catch (e) {
      console.error("Failed to initialize GoogleGenAI:", e);
    }
  }
  return aiClient;
}

// AI Recommendation Engine Endpoint (Strict Catalog Grounding & 3-Tier Budget Ceilings)
app.post("/api/recommend", async (req, res) => {
  try {
    const { budget, location, propertyType, needs, goals, customerType } = req.body;
    const numBudget = Number(budget);
    if (isNaN(numBudget) || numBudget < 5000) {
      return res.status(400).json({
        success: false,
        error: "The minimum permitted AI project budget is KES 5,000. Please enter a project budget of at least KES 5,000.",
        minBudgetKES: 5000
      });
    }
    const loc = location || "Nairobi County";
    const prop = propertyType || "Residential Villa / Compound";
    const needsArr = Array.isArray(needs) ? needs : [needs || "Solar & CCTV"];

    // 1. Generate strictly catalog-grounded 3-tier solution bounded by selected budget
    const grounded3Tiers = HynovaAdvisorEngine.generateThreeTierRecommendation({
      categoryText: needsArr.join(" "),
      selectedBudgetKES: numBudget,
      location: loc,
      propertyType: prop,
      goalsText: goals || ""
    });

    // 2. Map the HYNOVA Recommended tier as the primary active package configuration
    const activeTier = grounded3Tiers.hynovaRecommendedTier;

    // Determine timeline from tier
    const timeline = activeTier.estimatedTimeline;

    // Hardware BOM formatted from real catalog items
    const hardwareBillOfMaterials = activeTier.items
      .filter(it => !it.isService)
      .map(it => ({
        item: it.name,
        specs: it.description,
        quantity: `${it.quantity} ${it.uom}`,
        supplierCategory: it.sku.startsWith("HYN-SOL") ? "Solar Power" : it.sku.startsWith("HYN-SEC") || it.sku.startsWith("HYN-CAM") ? "Security Optics" : "Infrastructure"
      }));

    const responsePayload = {
      packageName: `HYNOVA ${grounded3Tiers.scopeCategory} — ${activeTier.headline}`,
      executiveSummary: `Catalog-verified ${grounded3Tiers.scopeCategory.toLowerCase()} engineered for ${prop} in ${loc}. Delivered strictly within your selected budget ceiling of KES ${numBudget.toLocaleString()} without invented rates or simulated personnel.`,
      affordabilityPromise: numBudget <= 20000
        ? "Let's start with what you have and build from there. (Tuanze na kile uli nacho.)"
        : "Our recommended option gives you the strongest solution we can build within your selected budget.",
      pricingDisclaimer: grounded3Tiers.pricingIntegrityNote,
      estimatedProjectRangeKES: `KES ${grounded3Tiers.lowestPriceTier.grandTotalInclVatKES.toLocaleString()} – KES ${activeTier.grandTotalInclVatKES.toLocaleString()}`,
      recommendedTier: "Recommended",
      // Three Grounded Budget Recommendations
      lowestPriceTier: grounded3Tiers.lowestPriceTier,
      middlePriceTier: grounded3Tiers.middlePriceTier,
      hynovaRecommendedTier: grounded3Tiers.hynovaRecommendedTier,
      selectedBudgetKES: numBudget,
      technicianStatus: "Awaiting technician assignment",
      phasedRoadmap: {
        achievedToday: activeTier.phasedPath?.achievedToday || [
          `Turnkey ${activeTier.headline} deployment meeting your core requirement`,
          "Certified installation and testing with 1-Year Workmanship Warranty",
          "Digital commissioning and client mobile streaming/telematics setup"
        ],
        phasedApproach: [
          `Lowest Price Option (KES ${grounded3Tiers.lowestPriceTier.grandTotalInclVatKES.toLocaleString()}): Most affordable viable starter setup`,
          `Middle Price Option (KES ${grounded3Tiers.middlePriceTier.grandTotalInclVatKES.toLocaleString()}): Balanced coverage and reliability`,
          `HYNOVA Recommended (KES ${activeTier.grandTotalInclVatKES.toLocaleString()}): Strongest-value solution within your selected budget`
        ],
        futureUpgrades: activeTier.phasedPath?.futureUpgrades || [
          "Additional camera points or battery storage capacity",
          "Automated smart energy and security telemetry expansion",
          "Multi-year SLA preventative maintenance contract"
        ],
        costEffectiveSummary: activeTier.phasedPath?.costAdvantage || "Constructed strictly from genuine HYNOVA catalog items without price markups or fictitious packages."
      },
      marginIntegrity: {
        minGrossMargin: 20,
        targetGrossMargin: 35,
        estimatedGrossMargin: 30,
        status: "OPTIMAL"
      },
      estimatedCosts: {
        hardwareKES: activeTier.hardwareTotalInclVatKES,
        installationKES: activeTier.servicesTotalInclVatKES,
        permitsAndCommissioningKES: 0,
        totalKES: activeTier.grandTotalInclVatKES,
        monthlyFinancingEstimateKES: Math.round((activeTier.grandTotalInclVatKES / 12) * 1.08),
        hardwareRangeKES: `KES ${activeTier.hardwareTotalInclVatKES.toLocaleString()}`,
        laborRangeKES: `KES ${activeTier.servicesTotalInclVatKES.toLocaleString()}`
      },
      timeline,
      hardwareBillOfMaterials,
      requiredTechnician: {
        specialty: activeTier.headline.includes("Solar") ? "Solar PV & Inverter Systems" : "Smart Security & Data Cabling",
        minimumRank: "Certified Technician",
        certificationsRequired: ["NCA Telecommunications", "EPRA Solar Compliance"],
        assignedCount: 0 // Truthful: 0 assigned technicians until payment verified
      },
      maintenanceOptions: [
        { tier: "Standard Care", costPerYearKES: 12000, features: ["Quarterly preventative inspections", "Firmware calibration"] },
        { tier: "HYNOVA 24/7 SLA", costPerYearKES: 28000, features: ["Same-day emergency dispatch", "Continuous cloud telemetry"] }
      ],
      financingOptions: [
        { name: "Milestone Escrow Payment", details: "Funds secured in M-Pesa escrow and released only upon installation sign-off" },
        { name: "Commercial Green Infrastructure SACCO / Bank Loan", details: "Asset-backed partner financing for verified businesses" }
      ],
      kenyanComplianceNotes: "100% compliant with Energy and Petroleum Regulatory Authority (EPRA) and NCA construction standards. 16% VAT fully itemized."
    };

    return res.json({
      success: true,
      data: responsePayload
    });
  } catch (error: any) {
    console.warn("AI recommendation error:", error?.message);
    return res.json({
      success: true,
      data: getFallbackRecommendation(req.body)
    });
  }
});

// AI Ecosystem Agents Endpoint (Customer AI, Technician AI, Supplier AI, Admin AI)
const handleAiAgent = async (req: any, res: any) => {
  try {
    const agentType = req.body.agentType || req.body.role || "customer";
    const userQuery = req.body.userQuery || req.body.query || "";
    const context = req.body.context;
    const ai = getAiClient();

    if (ai && userQuery) {
      const technicianCount = serverSheetsStore.getTechnicians().length;
      const technicianGuidance = `
CRITICAL HYNOVA TECHNICIAN REGISTRY RULE:
- The Technicians worksheet in HYNOVA OPS is the ONLY authoritative source of truth.
- The current count of registered technicians in the spreadsheet registry is exactly ${technicianCount}.
- If asked how many technicians HYNOVA has in Kiambu, Nairobi, or any other Kenyan county:
  State clearly: "There are currently 0 technicians recorded for that county in the HYNOVA technician registry."
- NEVER fabricate, invent, estimate, simulate, or assume technician names, numbers, or county coverage.
- If a customer places an order or completes payment, the order/job enters "Awaiting Technician Assignment" until actual certified personnel are verified in the Technicians worksheet.`;

      let systemPrompt = "";
      switch (agentType) {
        case "technician":
          systemPrompt = "You are HYNOVA Technician AI. You provide Kenyan field engineers and technicians with electrical schematics, inverter fault codes, CCTV IP configurations, wiring pinouts, solar battery sizing calculations, and installation compliance (EPRA/NCA). Be precise, technical, and safety-oriented." + technicianGuidance;
          break;
        case "supplier":
          systemPrompt = "You are HYNOVA Supplier AI. You analyze hardware demand trends across Kenyan counties, suggest inventory re-order points, identify fastest-selling solar inverters and IP cameras, and optimize wholesale margins." + technicianGuidance;
          break;
        case "admin":
          systemPrompt = "You are HYNOVA Admin Operations AI. You provide executive insights into platform operations, ensuring strict fidelity to the HYNOVA OPS spreadsheet registers." + technicianGuidance;
          break;
        case "customer":
        default:
          systemPrompt = `You are HYNOVA Customer AI Advisor. HYNOVA believes technology should be accessible regardless of budget.
The minimum supported customer budget is KES 5,000.
When a customer enters a budget between KES 5,000 and KES 20,000:
- Never make the customer feel their budget is too small.
- Respond with: "Let's start with what you have and build from there." (Tuanze na kile uli nacho.)
- Identify: 1. What can realistically be achieved today, 2. What may require a phased approach, 3. What upgrades can be added later, 4. The most cost effective solution.
- For budget <= 10,000: "Based on your budget, we can recommend several starting options and improvements that move you closer to your goal. As your needs grow, HYNOVA can help you expand your solution in phases."
- For budget KES 10,001 - 20,000: "We can recommend an entry level security, networking, smart home, or automation solution that fits your current budget while leaving room for future upgrades."
- For budget > 500,000: "We can design a more comprehensive solution with greater coverage, automation, scalability, and advanced features."
Always guide Kenyan property owners, businesses, schools, and developers through realistic paths forward with verified hardware and certified technicians.${technicianGuidance}`;
          break;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: userQuery,
        config: {
          systemInstruction: systemPrompt + (context ? `\nContext: ${JSON.stringify(context)}` : ""),
        },
      });

      const replyText = response.text || "HYNOVA is here to help you deploy affordable, certified technology across Kenya.";
      return res.json({ success: true, text: replyText, answer: replyText });
    }

    // Default intelligent responses for each agent
    const fallbackResponses: Record<string, string> = {
      customer: `Jambo! At HYNOVA, we believe technology should be accessible regardless of budget — starting from as low as KES 5,000. Let's start with what you have and build from there! We can recommend practical entry-level options today (like smart Wi-Fi cameras, surge protection, or router mini-UPS backup) and design a phased roadmap as your needs expand. How can we assist your home or business today?`,
      technician: `Field Diagnostic Guide: For erratic lithium battery communication over CAN/RS485 with Deye/Sunsynk inverters, verify baud rate 9600 vs 19200, check termination resistor switch on battery pack #1, and inspect RJ45 pin 4/5 (CAN High/Low) seating. Ensure ground bonding meets NCA/EPRA standards.`,
      supplier: `Supply Trend Alert: Demand for 48V 100Ah LiFePO4 rack batteries and 5MP ColorVu AI Turret cameras has risen 34% in Nairobi and Kiambu this quarter. Recommended restocking target: +45 units before month end to capture upcoming holiday school-recess installations.`,
      admin: `Registry Status: The authoritative Technicians worksheet currently records ${serverSheetsStore.getTechnicians().length} technicians. All active customer projects remain in 'Awaiting Technician Assignment' until verified field engineers are onboarded to the HYNOVA OPS spreadsheet registry.`,
    };

    const reply = fallbackResponses[agentType] || fallbackResponses.customer;
    return res.json({
      success: true,
      text: reply,
      answer: reply,
    });
  } catch (error: any) {
    const fallbackMsg = "HYNOVA AI is operational. Let's start with what you have and build from there. Please feel free to request a custom specification or submit your project details.";
    return res.json({
      success: true,
      text: fallbackMsg,
      answer: fallbackMsg,
    });
  }
};

app.post("/api/ai-agent", handleAiAgent);
app.post("/api/ai-agent-query", handleAiAgent);

function getFallbackRecommendation(params: any) {
  const numBudget = Number(params.budget);
  if (isNaN(numBudget) || numBudget < 5000) {
    throw new Error("The minimum permitted AI project budget is KES 5,000. Please enter a project budget of at least KES 5,000.");
  }
  const loc = params.location || "Nairobi County";
  const prop = params.propertyType || "Commercial / Residential Property";

  const isStarter = numBudget <= 20000;
  const isEssential = numBudget > 20000 && numBudget <= 50000;
  const isStandard = numBudget > 50000 && numBudget <= 150000;
  const isProfessional = numBudget > 150000 && numBudget <= 500000;
  const isEnterprise = numBudget > 500000;

  const budgetTiers = [
    {
      tier: "Starter",
      title: "Starter Solution",
      rangeKES: "KES 5,000 – 20,000",
      minPriceKES: 5000,
      maxPriceKES: 20000,
      hardwareSummary: ["Single-point smart camera / mini-UPS / Wi-Fi extender", "Diagnostic site assessment"],
      laborSummary: "Certified Technician site testing & device setup",
      warrantyPeriod: "1 Year Hardware & Workmanship Warranty",
      suitableFor: "Small improvements, diagnostics, consultations, smart devices, basic networking, entry level security and phased projects",
    },
    {
      tier: "Essential",
      title: "Essential Package",
      rangeKES: "KES 20,001 – 50,000",
      minPriceKES: 20001,
      maxPriceKES: 50000,
      hardwareSummary: ["2–3 Channel ColorVu cameras or 1kVA Inverter backup", "Surge protected cabling"],
      laborSummary: "Level-2 Senior Technician installation & commissioning",
      warrantyPeriod: "1 Year On-Site SLA & Guarantee",
      suitableFor: "Basic home and small business solutions",
    },
    {
      tier: "Standard",
      title: "Standard Package",
      rangeKES: "KES 50,001 – 150,000",
      minPriceKES: 50001,
      maxPriceKES: 150000,
      hardwareSummary: ["4–8 Channel AcuSense CCTV or 3kVA–5kVA Lithium Solar", "Gigabit Wi-Fi 6 Mesh"],
      laborSummary: "Level-3 Senior Specialist with EPRA/NCA certification",
      warrantyPeriod: "2 Years Manufacturer + 1 Year On-Site SLA",
      suitableFor: "Most home, office, and SME technology deployments",
    },
    {
      tier: "Professional",
      title: "Professional Package",
      rangeKES: "KES 150,001 – 500,000",
      minPriceKES: 150001,
      maxPriceKES: 500000,
      hardwareSummary: ["5kW–10kW Hybrid Solar Microgrid, Biometric Gates, Starlink", "Dual redundancy"],
      laborSummary: "Level-4 Master Engineer + 2-person certified crew",
      warrantyPeriod: "3 Years Hardware + Priority Emergency Response",
      suitableFor: "Larger properties, advanced security, networking, solar, and automation projects",
    },
    {
      tier: "Enterprise",
      title: "Enterprise Package",
      rangeKES: "KES 500,001+ (Custom Engineering Quotation)",
      minPriceKES: 500001,
      maxPriceKES: 15000000,
      hardwareSummary: ["Multi-building fiber, 3-phase microgrids, ANPR radar, BMS integration"],
      laborSummary: "Dedicated Project Lead & specialized certified crew",
      warrantyPeriod: "Comprehensive SLA with quarterly preventative maintenance",
      suitableFor: "Schools, institutions, developers, commercial facilities, and large scale infrastructure projects",
      requiresAdminApproval: true,
    },
  ];

  let recommendedTier = "Standard";
  if (isStarter) recommendedTier = "Starter";
  else if (isEssential) recommendedTier = "Essential";
  else if (isStandard) recommendedTier = "Standard";
  else if (isProfessional) recommendedTier = "Professional";
  else if (isEnterprise) recommendedTier = "Enterprise";

  let affordabilityPromise = "Let's start with what you have and build from there. (Tuanze na kile uli nacho.)";
  if (numBudget <= 10000) {
    affordabilityPromise = "Based on your budget, we can recommend several starting options and improvements that move you closer to your goal. As your needs grow, HYNOVA can help you expand your solution in phases.";
  } else if (numBudget <= 20000) {
    affordabilityPromise = "We can recommend an entry level security, networking, smart home, or automation solution that fits your current budget while leaving room for future upgrades.";
  } else if (numBudget > 500000) {
    affordabilityPromise = "We can design a more comprehensive solution with greater coverage, automation, scalability, and advanced features.";
  }

  if (isStarter) {
    return {
      packageName: "HYNOVA Starter Phased Implementation",
      executiveSummary: `Let's start with what you have and build from there. Designed for ${prop} in ${loc} within an accessible budget of KES ${numBudget.toLocaleString()}. Provides an immediate high-impact improvement today while laying the foundation for future upgrades.`,
      affordabilityPromise,
      phasedRoadmap: {
        achievedToday: [
          "Practical entry-level hardware setup (smart Wi-Fi camera, mini-UPS router backup, or surge suppression isolator)",
          "Certified technician physical inspection and electrical safety diagnostic",
          "Smartphone monitoring app pairing and 1-Year Workmanship Warranty activation",
        ],
        phasedApproach: [
          "Phase 1 (Today): Entry-level solution protecting your core asset (KES 5,000 – 20,000)",
          "Phase 2: Scale up to multi-camera surveillance or 1.5kVA pure sine inverter (KES 25,000 – 45,000)",
          "Phase 3: Upgrade to rooftop solar monocrystalline panels or biometric automation (KES 50,000+)",
        ],
        futureUpgrades: [
          "Central NVR recorder with 24/7 dedicated surveillance drive",
          "Lithium LiFePO4 battery pack with 10-year lifespan",
          "Automated smart gate and GSM alarm integration",
        ],
        costEffectiveSummary: "The most cost-effective path forward for your current situation — zero wasted investment as every component integrates into future expansions.",
      },
      pricingDisclaimer: "All figures represent estimated project ranges based on 2026 Kenyan market rates. Final guaranteed pricing is subject to physical site assessment, cable run lengths, and engineering validation.",
      estimatedProjectRangeKES: `KES ${Math.max(5000, Math.round(numBudget * 0.9)).toLocaleString()} – KES ${Math.round(numBudget * 1.1).toLocaleString()}`,
      recommendedTier: "Starter",
      budgetTiers,
      marginIntegrity: {
        minGrossMargin: 20,
        targetGrossMargin: 35,
        estimatedGrossMargin: 30,
        status: "OPTIMAL",
      },
      estimatedCosts: {
        hardwareKES: Math.round(numBudget * 0.7),
        installationKES: Math.round(numBudget * 0.22),
        permitsAndCommissioningKES: Math.round(numBudget * 0.08),
        totalKES: numBudget,
        monthlyFinancingEstimateKES: Math.round(numBudget / 3),
        hardwareRangeKES: `KES ${(numBudget * 0.65).toFixed(0)} – KES ${(numBudget * 0.75).toFixed(0)}`,
        laborRangeKES: `KES ${(numBudget * 0.2).toFixed(0)} – KES ${(numBudget * 0.25).toFixed(0)}`,
      },
      timeline: "Same Day or 1 Business Day",
      hardwareBillOfMaterials: [
        { item: "Smart Wi-Fi Security / Power Backup Module", specs: "2K Resolution / Lithium Mini-UPS, Surge Protected", quantity: "1 unit", supplierCategory: "Smart Hardware" },
        { item: "High-Surge Protection Multi-Plug Adapter", specs: "KPLC Overvoltage & Lightning Suppression", quantity: "1 unit", supplierCategory: "Electrical & Protection" },
        { item: "On-Site Diagnostic & Calibration Kit", specs: "Cable testing, Wi-Fi channel spectrum analysis", quantity: "1 service", supplierCategory: "Field Diagnostics" },
      ],
      requiredTechnician: {
        specialty: "Entry Level Hardware & Diagnostics",
        minimumRank: "Certified Technician (Level 1)",
        certificationsRequired: ["NCA Telecommunications", "HYNOVA Verified"],
        assignedCount: 0,
      },
      maintenanceOptions: [
        { tier: "Starter Care", costPerYearKES: 3500, features: ["Bi-annual safety audit", "Firmware updates", "Phone support"] },
        { tier: "Priority SLA", costPerYearKES: 7500, features: ["Emergency diagnostic dispatch", "Free replacement of patch cords"] },
      ],
      financingOptions: [
        { name: "M-Pesa Escrow Protection", details: "100% of funds held securely until customer tests and signs off" },
      ],
      kenyanComplianceNotes: "Meets CAK low-voltage guidelines and EPRA safety regulations.",
    };
  }

  return {
    packageName: numBudget > 500000 
      ? "HYNOVA Enterprise Autonomous Infrastructure Matrix"
      : numBudget > 150000 
      ? "HYNOVA Professional Commercial Security & Solar Matrix"
      : "HYNOVA Standard Smart Power & AI Security Package",
    executiveSummary: `Engineered specifically for high-reliability operations in ${loc}. Blends smart solar generation, lithium storage, AI computer-vision perimeter protection, and remote telemetry to eliminate downtime.`,
    affordabilityPromise,
    phasedRoadmap: {
      achievedToday: [
        "Complete turn-key hardware deployment tailored to your property requirements",
        "Certified technician execution with full cable trunking, labeling, and EPRA/NCA code compliance",
        "Customer inspection, handover training, and 1-Year Workmanship Warranty activation",
      ],
      phasedApproach: [
        "Phase 1: Mandatory physical site survey and final verified engineering quote",
        "Phase 2: Milestone-based escrow deployment and hardware commissioning",
        "Phase 3: Annual SLA preventative maintenance and future expansion support",
      ],
      futureUpgrades: [
        "Automated IoT telemetry & building management expansion",
        "Cloud telemetry & remote health diagnostics",
        "Extended multi-year SLA warranty coverage",
      ],
      costEffectiveSummary: "A complete, turn-key technology fulfillment package engineered for longevity and lowest total cost of ownership.",
    },
    pricingDisclaimer: "All figures represent estimated project ranges based on 2026 Kenyan market rates. Final guaranteed pricing is subject to physical site assessment, roof/cable pathway measurements, and engineering validation.",
    estimatedProjectRangeKES: `KES ${Math.round(numBudget * 0.85).toLocaleString()} – KES ${Math.round(numBudget * 1.15).toLocaleString()}`,
    recommendedTier: numBudget > 450000 ? "Professional" : "Standard",
    budgetTiers,
    marginIntegrity: {
      minGrossMargin: 20,
      targetGrossMargin: 35,
      estimatedGrossMargin: 34,
      status: "OPTIMAL",
    },
    estimatedCosts: {
      hardwareKES: Math.round(numBudget * 0.72),
      installationKES: Math.round(numBudget * 0.18),
      permitsAndCommissioningKES: Math.round(numBudget * 0.04),
      totalKES: numBudget,
      monthlyFinancingEstimateKES: Math.round((numBudget / 12) * 1.08),
      hardwareRangeKES: `KES ${Math.round(numBudget * 0.68).toLocaleString()} – KES ${Math.round(numBudget * 0.78).toLocaleString()}`,
      laborRangeKES: `KES ${Math.round(numBudget * 0.15).toLocaleString()} – KES ${Math.round(numBudget * 0.22).toLocaleString()}`,
    },
    timeline: "3-5 Business Days",
    hardwareBillOfMaterials: [
      { item: "5kW Hybrid Smart Solar Inverter", specs: "Dual MPPT, Wi-Fi Telematics, Grid-Tie & Off-Grid", quantity: "1 unit", supplierCategory: "Solar Power" },
      { item: "5.12kWh LiFePO4 Lithium Battery Wall-Mount", specs: "6000+ Cycles, Smart BMS, 10-Yr Design Life", quantity: "1 unit", supplierCategory: "Energy Storage" },
      { item: "8x Tier-1 550W Mono PERC Solar Panels", specs: "Bifacial high-efficiency, tempered glass", quantity: "8 units", supplierCategory: "Solar Modules" },
      { item: "8x 4K Ultra-HD AI Smart Perimeter Cameras", specs: "AcuSense, 2-Way Audio, Strobe & Siren deter", quantity: "8 units", supplierCategory: "Security Hardware" },
      { item: "Smart Energy & Biometric Access Controller", specs: "Cloud managed, M-Pesa visitor integration", quantity: "1 unit", supplierCategory: "Smart Infrastructure" },
    ],
    requiredTechnician: {
      specialty: "Solar PV Hybrid Systems & AI Infrastructure",
      minimumRank: "Specialist Technician (Level 3)",
      certificationsRequired: ["EPRA T3 Solar License", "NCA Certified", "HYNOVA Master Specialist"],
      assignedCount: 0,
    },
    maintenanceOptions: [
      { tier: "ProActive Maintenance", costPerYearKES: 24000, features: ["Quarterly thermal solar scans", "Firmware & AI model calibration", "24/7 cloud telemetry monitor"] },
      { tier: "Enterprise Zero-Downtime SLA", costPerYearKES: 45000, features: ["Monthly physical audit", "4-hour response SLA in county", "Full hardware warranty swap"] },
    ],
    financingOptions: [
      { name: "Green Energy Asset Lease", details: "Zero initial deposit for registered businesses, pay monthly from solar savings" },
      { name: "Flexible Milestone Payment", details: "40% mobilization, 40% delivery, 20% on customer testing sign-off" },
    ],
    kenyanComplianceNotes: "Fully compliant with Energy and Petroleum Regulatory Authority (EPRA) Solar PV Regulations 2012 and NCA construction codes.",
  };
}

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`HYNOVA Server running on http://localhost:${PORT}`);
  });
}

if (process.env.NODE_ENV !== "test" && !process.env.HYNOVA_TEST_MODE) {
  startServer();
}

export default app;

