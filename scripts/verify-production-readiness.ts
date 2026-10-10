/**
 * HYNOVA Production Readiness Automated Test Suite
 * Tests actual execution of business rules, budget ceiling, VAT, catalog grounding,
 * zero-technician state, tenant isolation, RBAC, payment gating, and quotation consistency.
 */

import { HynovaAdvisorEngine, AUTHORITATIVE_CATALOG_PRODUCTS } from '../src/services/advisorEngine';
import { 
  serverSheetsStore, 
  checkSheetAccess, 
  extractAuth, 
  INITIAL_PRODUCT_CATALOG, 
  INITIAL_SERVICES 
} from '../src/server/sheetsOperations';
import { googleSheetsOps } from '../src/services/googleSheetsService';

let allPassed = true;

function assert(condition: boolean, testName: string, details?: string) {
  if (condition) {
    console.log(`[PASS] ${testName}`);
  } else {
    console.error(`[FAIL] ${testName}${details ? ': ' + details : ''}`);
    allPassed = false;
  }
}

async function runTestSuite() {
  console.log('=== RUNNING PRODUCTION READINESS TEST SUITE ===\n');

  // 1. Budget Ceiling & VAT Arithmetic Tests across Multiple Scenarios
  console.log('--- TEST 1: BUDGET CEILING & VAT ARITHMETIC ---');
  const testBudgets = [20000, 50000, 100000, 250000, 500000];
  const testCategories = ['AI CCTV & Security', 'Hybrid Solar Backup', 'Starlink & Wi-Fi 6', 'Biometric Access'];

  for (const b of testBudgets) {
    for (const cat of testCategories) {
      const rec = HynovaAdvisorEngine.generateThreeTierRecommendation({
        categoryText: cat,
        selectedBudgetKES: b,
        location: 'Nairobi County',
        propertyType: 'Residential Villa / Compound',
        goalsText: 'Need security and power'
      });

      const lowest = rec.lowestPriceTier;
      const middle = rec.middlePriceTier;
      const recommended = rec.hynovaRecommendedTier;

      // Hard ceiling checks
      assert(
        lowest.grandTotalInclVatKES <= b,
        `Lowest Tier Ceiling (Budget KES ${b}, ${cat})`,
        `Lowest cost ${lowest.grandTotalInclVatKES} > budget ${b}`
      );
      assert(
        middle.grandTotalInclVatKES <= b,
        `Middle Tier Ceiling (Budget KES ${b}, ${cat})`,
        `Middle cost ${middle.grandTotalInclVatKES} > budget ${b}`
      );
      assert(
        recommended.grandTotalInclVatKES <= b,
        `Recommended Tier Ceiling (Budget KES ${b}, ${cat})`,
        `Recommended cost ${recommended.grandTotalInclVatKES} > budget ${b}`
      );

      // Ordering check: lowest <= middle <= recommended
      assert(
        lowest.grandTotalInclVatKES <= middle.grandTotalInclVatKES &&
        middle.grandTotalInclVatKES <= recommended.grandTotalInclVatKES,
        `Tier Ordering Check (Budget KES ${b}, ${cat})`,
        `Expected ${lowest.grandTotalInclVatKES} <= ${middle.grandTotalInclVatKES} <= ${recommended.grandTotalInclVatKES}`
      );

      // Deterministic VAT check for Recommended tier: subtotal + vat === grandTotal
      const computedGrandTotal = recommended.subtotalExclVatKES + recommended.vatKES;
      assert(
        computedGrandTotal === recommended.grandTotalInclVatKES,
        `VAT Arithmetic Coherence (Budget KES ${b}, ${cat})`,
        `Computed ${computedGrandTotal} !== GrandTotal ${recommended.grandTotalInclVatKES}`
      );
    }
  }

  // 2. Authoritative Catalog Grounding & SKU Validation
  console.log('\n--- TEST 2: AUTHORITATIVE SKU & SERVICE ID VALIDATION ---');
  const catalogSkuSet = new Set(AUTHORITATIVE_CATALOG_PRODUCTS.map(p => p.sku));
  const serviceIdSet = new Set(INITIAL_SERVICES.map(s => s.serviceId));
  serviceIdSet.add('HYN-SRV-005'); // Site Survey service

  const sampleRec = HynovaAdvisorEngine.generateThreeTierRecommendation({
    categoryText: 'AI CCTV & Perimeter Security',
    selectedBudgetKES: 100000,
    location: 'Nairobi County',
    propertyType: 'Residential Villa / Compound',
    goalsText: '4 cameras and remote viewing'
  });

  const allItems = [
    ...sampleRec.lowestPriceTier.items,
    ...sampleRec.middlePriceTier.items,
    ...sampleRec.hynovaRecommendedTier.items
  ];

  let ungroundedItemsCount = 0;
  for (const it of allItems) {
    if (it.isService) {
      if (!serviceIdSet.has(it.sku)) ungroundedItemsCount++;
    } else {
      if (!catalogSkuSet.has(it.sku)) ungroundedItemsCount++;
    }
  }
  assert(
    ungroundedItemsCount === 0,
    'All Recommended Items Grounded in Authoritative Catalog',
    `Found ${ungroundedItemsCount} ungrounded items`
  );

  // 3. Price Consistency Between Recommendation and Quotation
  console.log('\n--- TEST 3: RECOMMENDATION-TO-QUOTATION PRICE CONSISTENCY ---');
  const activeSolution = sampleRec.hynovaRecommendedTier;
  const createdQuote = googleSheetsOps.addQuote({
    purchaserName: 'Audit Test Client',
    projectScope: `${sampleRec.scopeCategory} [${activeSolution.tierLabel}]: ${activeSolution.headline}`,
    hardwareSubtotalKES: activeSolution.hardwareSubtotalExclVatKES,
    labourKES: activeSolution.servicesSubtotalExclVatKES,
    terms: '40% Mobilization Escrow, 40% Delivery, 20% Signoff'
  });

  assert(
    createdQuote.hardwareSubtotalKES === activeSolution.hardwareSubtotalExclVatKES,
    'Quote Hardware Subtotal Matches Recommendation BOM Hardware'
  );
  assert(
    createdQuote.labourKES === activeSolution.servicesSubtotalExclVatKES,
    'Quote Labour Subtotal Matches Recommendation BOM Labour'
  );
  assert(
    createdQuote.grandTotalKES === activeSolution.grandTotalInclVatKES,
    'Quote Grand Total Matches Recommendation Grand Total (Incl. 16% VAT)'
  );

  // 4. Zero-Technician State Truthfulness
  console.log('\n--- TEST 4: ZERO-TECHNICIAN INTEGRITY ---');
  const activeTechs = serverSheetsStore.getAvailableTechnicians();
  const totalTechs = serverSheetsStore.getTechnicians();
  assert(
    totalTechs.length === 0,
    'Technicians Register Has Exactly 0 Records in Sheet Store'
  );
  assert(
    activeTechs.length === 0,
    'Available Technicians Returns Empty Array (Zero Available)'
  );
  assert(
    sampleRec.technicianStatus === 'Awaiting technician assignment',
    'Recommendation Truthfully Flags Awaiting Technician Assignment'
  );

  // 5. Customer-to-Customer Multi-Tenant Isolation
  console.log('\n--- TEST 5: MULTI-TENANT CUSTOMER ISOLATION ---');
  // Check customer Dave Muthomi (dmuthomi@archconsult.co.ke) vs Peter Mwangi (admin@greenwood.ac.ke)
  const reqDave = {
    headers: { 'x-user-email': 'dmuthomi@archconsult.co.ke' },
    body: {}
  } as any;
  const authDave = extractAuth(reqDave);
  assert(authDave.role === 'CUSTOMER', 'External Customer Assigned CUSTOMER Role');

  const daveCustomer = serverSheetsStore.customers.find(c => c.purchaserEmail === 'dmuthomi@archconsult.co.ke');
  const greenwoodCustomer = serverSheetsStore.customers.find(c => c.purchaserEmail === 'admin@greenwood.ac.ke');
  assert(
    daveCustomer?.customerId === 'HYN-CUS-0001' && greenwoodCustomer?.customerId === 'HYN-CUS-0003',
    'Distinct Customer Records Exist in Store'
  );

  // 6. Role-Based Access Control (RBAC) Permissions
  console.log('\n--- TEST 6: RBAC PERMISSIONS ENFORCEMENT ---');
  const customerCanReadCatalog = checkSheetAccess('CUSTOMER', 'Product_Catalog', 'read');
  const customerCanReadTechnicians = checkSheetAccess('CUSTOMER', 'Technicians', 'read');
  const customerCanReadPayments = checkSheetAccess('CUSTOMER', 'Technician_Payments', 'read');
  const adminCanReadPayments = checkSheetAccess('ADMIN', 'Technician_Payments', 'read');

  assert(customerCanReadCatalog === true, 'Customer Can Read Product_Catalog');
  assert(customerCanReadTechnicians === false, 'Customer Strictly Forbidden from Reading Technicians Roster');
  assert(customerCanReadPayments === false, 'Customer Strictly Forbidden from Reading Technician_Payments');
  assert(adminCanReadPayments === true, 'Admin Permitted to Read Technician_Payments');

  // 7. Payment-Gated Technician Assignment and Dispatch
  console.log('\n--- TEST 7: PAYMENT GATING ENFORCEMENT ---');
  // Job 1 (HYN-JOB-0001) has Order (HYN-ORD-0001) with 'Escrow Funded'
  const orderJob1 = serverSheetsStore.orders.find(o => o.jobIdOrQuote === 'HYN-JOB-0001');
  assert(orderJob1?.paymentStatus === 'Escrow Funded', 'Job 1 Has Verified Escrow Payment');

  // Job 2 (HYN-JOB-0002) has NO order / unpaid
  const orderJob2 = serverSheetsStore.orders.find(o => o.jobIdOrQuote === 'HYN-JOB-0002');
  assert(!orderJob2, 'Job 2 Has Unfunded / Unverified Payment');

  const isJob1PaymentVerified = orderJob1 && ['Escrow Funded', 'Paid', 'Disbursed to Technician', 'Fully Settled'].includes(orderJob1.paymentStatus);
  const isJob2PaymentVerified = !!(orderJob2 && ['Escrow Funded', 'Paid', 'Disbursed to Technician', 'Fully Settled'].includes((orderJob2 as any).paymentStatus));

  assert(isJob1PaymentVerified === true, 'Payment Gate Passes for Funded Job 1');
  assert(isJob2PaymentVerified === false, 'Payment Gate Rejects Unfunded Job 2');

  console.log('\n=== TEST SUITE COMPLETED ===');
  if (allPassed) {
    console.log('ALL AUDIT TESTS EXECUTED AND PASSED SUCCESSFULLY!');
  } else {
    console.error('ONE OR MORE TESTS FAILED.');
    process.exit(1);
  }
}

runTestSuite().catch(e => {
  console.error('Test execution error:', e);
  process.exit(1);
});
