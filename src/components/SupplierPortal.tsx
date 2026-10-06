import React, { useState } from 'react';
import { 
  Store, 
  Package, 
  TrendingUp, 
  Truck, 
  Coins, 
  ShieldCheck, 
  Plus, 
  Search, 
  CheckCircle2, 
  AlertTriangle,
  Building,
  FileText
} from 'lucide-react';
import { SupplierProduct } from '../types';
import { SUPPLIER_PRODUCTS } from '../data/mockData';

export const SupplierPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'orders' | 'analytics' | 'onboarding'>('catalog');
  const [products, setProducts] = useState<SupplierProduct[]>(SUPPLIER_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const showStatus = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // New Product Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Solar Energy',
    sku: '',
    wholesalePriceKES: 0,
    retailPriceKES: 0,
    stockCount: 10,
    warehouseLocation: 'Nairobi (Industrial Area)',
    warrantyYears: 2,
  });

  // Supplier Onboarding Form State
  const [onboardSuccess, setOnboardSuccess] = useState(false);
  const [onboardForm, setOnboardForm] = useState({
    businessName: '',
    registrationNumber: '',
    kraPin: '',
    categories: ['Solar Energy', 'Smart Security'],
    warehouseLocations: 'Industrial Area, Nairobi',
    contactPerson: '',
    phone: '',
    warrantyPolicy: '2-Year Direct Replacement for Inverters and Batteries',
  });

  // Simulated Orders state
  const [orders, setOrders] = useState([
    {
      id: 'ORD-8941',
      date: '2026-03-20',
      client: 'Nalepo Safari Lodge (Naivasha)',
      technician: 'Dennis Koech (Level 3)',
      items: 'Deye 8kW Hybrid Inverter (x1), Pylontech 4.8kWh Lithium (x2)',
      totalKES: 580000,
      status: 'Ready for Dispatch',
      dispatchAddress: 'Direct to Site via HYNOVA Freight, Naivasha',
    },
    {
      id: 'ORD-8938',
      date: '2026-03-19',
      client: 'Ruaka Heights Syndicate',
      technician: 'Samuel Mutiso (Level 2)',
      items: 'Centurion D5 Smart Gate Motor Kit (x1), ZKTeco MultiBio (x1)',
      totalKES: 135000,
      status: 'Delivered',
      dispatchAddress: 'Delivered to Site, Ruaka Bypass',
    },
    {
      id: 'ORD-8932',
      date: '2026-03-18',
      client: 'Dr. Amina Patel (Karen)',
      technician: 'Dennis Koech (Level 3)',
      items: 'Hikvision 8-Cam 4K AcuSense ColorVu Kit (x1)',
      totalKES: 145000,
      status: 'Settled to Bank',
      dispatchAddress: 'Pick-up at Industrial Area Warehouse',
    },
  ]);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const item: SupplierProduct = {
      id: `prod-${Date.now()}`,
      supplierName: 'Direct Importer Wholesale',
      name: newProduct.name,
      category: newProduct.category,
      sku: newProduct.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      wholesalePriceKES: Number(newProduct.wholesalePriceKES),
      retailPriceKES: Number(newProduct.retailPriceKES),
      stockCount: Number(newProduct.stockCount),
      warehouseLocation: newProduct.warehouseLocation,
      warrantyYears: Number(newProduct.warrantyYears),
      kebsApproved: true,
      inStock: true,
    };
    setProducts([item, ...products]);
    setShowAddModal(false);
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="py-10 bg-[#FFFFFF] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#EEECEC] mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C01E25] bg-[#F0C9CB]/40 px-2.5 py-0.5 rounded-full">
                Equipment Supplier Portal
              </span>
              <span className="text-xs font-semibold text-[#5C4D50]">
                Verified Bonded Inventory Hub
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E1B1C] mt-1">
              Supplier Marketplace & Orders
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-[#C01E25] hover:bg-[#a1181e] text-[#FFFFFF] text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Stock SKU</span>
            </button>
          </div>
        </div>

        {/* Global Supplier Status Feedback */}
        {statusMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-[#F0C9CB]/40 border border-[#C01E25] text-[#C01E25] text-xs sm:text-sm font-bold flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#C01E25]" />
              <span>{statusMessage}</span>
            </div>
            <button onClick={() => setStatusMessage(null)} className="text-xs text-[#C01E25] font-bold">✕</button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-[#EEECEC] scrollbar-none">
          {[
            { id: 'catalog', label: 'Product Catalog & Inventory', icon: Package },
            { id: 'orders', label: 'Order Requests & Dispatch', icon: Truck },
            { id: 'analytics', label: 'Wholesale Sales Performance', icon: TrendingUp },
            { id: 'onboarding', label: 'Supplier Onboarding & KRA', icon: Building },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#C01E25] text-[#FFFFFF] shadow-sm shadow-[#C01E25]/20'
                    : 'bg-[#EEECEC]/60 text-[#5C4D50] hover:text-[#1E1B1C] hover:bg-[#EEECEC]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: PRODUCT CATALOG & INVENTORY */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-[#8F7B7F] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search SKU or product..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2 bg-[#EEECEC]/50 border border-[#EEECEC] rounded-xl outline-none focus:border-[#C01E25]"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none w-full sm:w-auto">
                {['All', 'Solar Energy', 'Smart Security', 'Networking', 'Access Control'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-[#C01E25] text-[#FFFFFF]'
                        : 'bg-[#EEECEC] text-[#5C4D50] hover:bg-[#F0C9CB]/30'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Table */}
            <div className="bg-[#FFFFFF] rounded-3xl border border-[#EEECEC] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#EEECEC]/50 text-[#5C4D50] font-bold uppercase tracking-wider border-b border-[#EEECEC]">
                    <tr>
                      <th className="p-4">Equipment & SKU</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Wholesale Price (KES)</th>
                      <th className="p-4">MSRP (KES)</th>
                      <th className="p-4">Warehouse & Stock</th>
                      <th className="p-4">KEBS / EPRA</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EEECEC]">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-[#EEECEC]/20 transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-[#1E1B1C]">{p.name}</div>
                          <div className="text-[11px] text-[#8F7B7F] font-mono">{p.sku} • {p.supplierName}</div>
                        </td>
                        <td className="p-4">
                          <span className="font-semibold text-[#5C4D50] bg-[#EEECEC] px-2 py-0.5 rounded">
                            {p.category}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-[#C01E25]">
                          KES {p.wholesalePriceKES.toLocaleString()}
                        </td>
                        <td className="p-4 font-semibold text-[#1E1B1C]">
                          KES {(p.retailPriceKES || p.priceKES || p.wholesalePriceKES * 1.25).toLocaleString()}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5 font-bold text-[#1E1B1C]">
                            <span className="w-2 h-2 rounded-full bg-[#C01E25]" />
                            <span>{p.stockCount || p.stockLevel || 10} units</span>
                          </div>
                          <div className="text-[10px] text-[#5C4D50]">{p.warehouseLocation || 'Nairobi Warehouse'}</div>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#C01E25] bg-[#F0C9CB]/40 px-2 py-0.5 rounded">
                            <ShieldCheck className="w-3 h-3" />
                            <span>{p.warrantyYears}yr Warranty</span>
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => showStatus(`Stock level for ${p.name} updated with inventory sync.`)}
                            className="text-xs font-bold text-[#C01E25] hover:underline cursor-pointer"
                          >
                            Update Stock
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDER REQUESTS & DISPATCH */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-extrabold text-[#1E1B1C]">Equipment Orders & Direct Site Dispatches</h2>
              <p className="text-xs text-[#5C4D50]">
                AI recommendation engine automatically converts client quotations into supplier purchase orders once customer escrow is funded.
              </p>
            </div>

            <div className="space-y-3">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#EEECEC] hover:border-[#DB7D81]/70 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#C01E25]">{ord.id}</span>
                      <span className="text-xs text-[#8F7B7F]">• {ord.date}</span>
                      <span className="text-[10px] font-bold uppercase bg-[#F0C9CB]/40 text-[#C01E25] px-2 py-0.5 rounded">
                        {ord.status}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-[#1E1B1C]">{ord.client}</h3>
                    <p className="text-xs text-[#5C4D50]">{ord.items}</p>
                    <div className="text-[11px] text-[#8F7B7F]">
                      Assigned Installer: <strong className="text-[#1E1B1C]">{ord.technician}</strong> • {ord.dispatchAddress}
                    </div>
                  </div>

                  <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-[#EEECEC]">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] uppercase font-bold text-[#5C4D50]">Order Value</span>
                      <div className="text-lg font-black text-[#C01E25]">
                        KES {ord.totalKES.toLocaleString()}
                      </div>
                    </div>

                    <button
                      onClick={() => showStatus(`Waybill for ${ord.id} generated for courier pickup and warehouse dispatch.`)}
                      className="bg-[#EEECEC] hover:bg-[#F0C9CB]/40 text-[#C01E25] text-xs font-bold px-3.5 py-2 rounded-xl border border-[#DB7D81]/40 transition-colors cursor-pointer"
                    >
                      Print Waybill
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SALES PERFORMANCE */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#EEECEC] shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5C4D50]">Total Monthly GMV</span>
                <div className="text-3xl font-black text-[#C01E25] mt-1">KES 14,850,000</div>
                <div className="text-xs text-[#5C4D50] mt-1">+24% compared to previous month</div>
              </div>

              <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#EEECEC] shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5C4D50]">Units Dispatched</span>
                <div className="text-3xl font-black text-[#1E1B1C] mt-1">142 SKUs</div>
                <div className="text-xs text-[#5C4D50] mt-1">Across 18 Kenyan counties</div>
              </div>

              <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#EEECEC] shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5C4D50]">Settlement Cycle</span>
                <div className="text-3xl font-black text-[#C01E25] mt-1">T+2 Days</div>
                <div className="text-xs text-[#5C4D50] mt-1">Direct RTGS / Pesalink to bank</div>
              </div>
            </div>

            <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#EEECEC] space-y-4">
              <h3 className="text-base font-bold text-[#1E1B1C]">Top Moving Infrastructure SKUs in Kenya</h3>
              <div className="space-y-2">
                {[
                  { name: 'Deye 5kW Hybrid Inverter (SUN-5K-SG03LP1)', share: '38% of total volume', gmv: 'KES 5,320,000' },
                  { name: 'Pylontech 4.8kWh LiFePO4 US3000C', share: '29% of total volume', gmv: 'KES 4,140,000' },
                  { name: 'Hikvision 8-Channel 4K AcuSense NVR Kit', share: '18% of total volume', gmv: 'KES 2,610,000' },
                  { name: 'Centurion D5 Smart Gate Motor Kit', share: '15% of total volume', gmv: 'KES 2,120,000' },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#EEECEC]/30 border border-[#EEECEC] flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-[#1E1B1C]">{item.name}</div>
                      <div className="text-[11px] text-[#5C4D50]">{item.share}</div>
                    </div>
                    <div className="text-right font-black text-[#C01E25]">
                      {item.gmv}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SUPPLIER ONBOARDING */}
        {activeTab === 'onboarding' && (
          <div className="max-w-3xl mx-auto bg-[#FFFFFF] p-6 sm:p-8 rounded-3xl border border-[#DB7D81]/40 shadow-xs space-y-6">
            <div className="text-center pb-4 border-b border-[#EEECEC]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C01E25] bg-[#F0C9CB]/40 px-3 py-1 rounded-full">
                Supplier Registration & KRA
              </span>
              <h2 className="text-2xl font-extrabold text-[#1E1B1C] mt-2">
                List Your Inventory on HYNOVA
              </h2>
              <p className="text-xs sm:text-sm text-[#5C4D50]">
                Connect your bonded warehouse directly to thousands of certified Kenyan installers and enterprise client RFPs.
              </p>
            </div>

            {onboardSuccess ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#F0C9CB]/50 text-[#C01E25] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-[#1E1B1C]">Supplier Dossier Under Verification</h3>
                <p className="text-xs text-[#5C4D50] max-w-md mx-auto">
                  Your KRA PIN and business registration have been submitted to HYNOVA Compliance. Our partner onboarding manager will schedule a warehouse inspection within 48 hours.
                </p>
                <button
                  onClick={() => { setOnboardSuccess(false); setActiveTab('catalog'); }}
                  className="bg-[#C01E25] hover:bg-[#a1181e] text-[#FFFFFF] text-xs font-bold px-6 py-3 rounded-xl transition-colors cursor-pointer"
                >
                  Return to Catalog
                </button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setOnboardSuccess(true); }} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#5C4D50] block mb-1">Company Registered Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rift Valley Solar Wholesale Ltd"
                      value={onboardForm.businessName}
                      onChange={(e) => setOnboardForm({ ...onboardForm, businessName: e.target.value })}
                      className="w-full text-xs bg-[#EEECEC]/50 border border-[#EEECEC] rounded-xl px-3 py-2.5 text-[#1E1B1C] outline-none focus:border-[#C01E25]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#5C4D50] block mb-1">KRA PIN Number</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. P051289412A"
                      value={onboardForm.kraPin}
                      onChange={(e) => setOnboardForm({ ...onboardForm, kraPin: e.target.value })}
                      className="w-full text-xs bg-[#EEECEC]/50 border border-[#EEECEC] rounded-xl px-3 py-2.5 text-[#1E1B1C] outline-none focus:border-[#C01E25]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#5C4D50] block mb-1">Contact Officer & Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Grace Wanjiru, Head of Logistics"
                      value={onboardForm.contactPerson}
                      onChange={(e) => setOnboardForm({ ...onboardForm, contactPerson: e.target.value })}
                      className="w-full text-xs bg-[#EEECEC]/50 border border-[#EEECEC] rounded-xl px-3 py-2.5 text-[#1E1B1C] outline-none focus:border-[#C01E25]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#5C4D50] block mb-1">Direct Mobile / WhatsApp</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 0722 000 000"
                      value={onboardForm.phone}
                      onChange={(e) => setOnboardForm({ ...onboardForm, phone: e.target.value })}
                      className="w-full text-xs bg-[#EEECEC]/50 border border-[#EEECEC] rounded-xl px-3 py-2.5 text-[#1E1B1C] outline-none focus:border-[#C01E25]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#5C4D50] block mb-1">Warehouse Locations in Kenya</label>
                  <input
                    type="text"
                    placeholder="e.g. Enterprise Road Industrial Area Nairobi, and Nyali Mombasa"
                    value={onboardForm.warehouseLocations}
                    onChange={(e) => setOnboardForm({ ...onboardForm, warehouseLocations: e.target.value })}
                    className="w-full text-xs bg-[#EEECEC]/50 border border-[#EEECEC] rounded-xl px-3 py-2.5 text-[#1E1B1C] outline-none focus:border-[#C01E25]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#5C4D50] block mb-1">Standard Warranty & RMA Policy</label>
                  <textarea
                    rows={2}
                    value={onboardForm.warrantyPolicy}
                    onChange={(e) => setOnboardForm({ ...onboardForm, warrantyPolicy: e.target.value })}
                    className="w-full text-xs bg-[#EEECEC]/50 border border-[#EEECEC] rounded-xl p-3 text-[#1E1B1C] outline-none focus:border-[#C01E25]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#C01E25] hover:bg-[#a1181e] text-[#FFFFFF] text-xs font-bold py-3.5 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Submit Supplier Partnership Application
                </button>
              </form>
            )}
          </div>
        )}

        {/* Modal: Add New Product */}
        {showAddModal && (
          <div className="fixed inset-0 bg-[#1E1B1C]/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-[#FFFFFF] p-6 sm:p-8 rounded-3xl border border-[#DB7D81]/50 max-w-lg w-full shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#EEECEC]">
                <h3 className="text-lg font-bold text-[#1E1B1C]">Add Stock Item to HYNOVA Catalog</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-xs font-bold text-[#5C4D50] hover:text-[#1E1B1C] cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleAddProduct} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-[#5C4D50] block mb-1">Equipment Name & Model</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jinko 580W Tiger Neo N-Type Solar Panel"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full bg-[#EEECEC]/50 border border-[#EEECEC] rounded-xl p-2.5 text-[#1E1B1C] outline-none focus:border-[#C01E25]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#5C4D50] block mb-1">Category</label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      className="w-full bg-[#EEECEC]/50 border border-[#EEECEC] rounded-xl p-2.5 text-[#1E1B1C] outline-none focus:border-[#C01E25]"
                    >
                      <option value="Solar Energy">Solar Energy</option>
                      <option value="Smart Security">Smart Security</option>
                      <option value="Networking">Networking</option>
                      <option value="Access Control">Access Control</option>
                      <option value="Operational Automation">Operational Automation</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-[#5C4D50] block mb-1">SKU Code</label>
                    <input
                      type="text"
                      placeholder="e.g. JNK-580-NEO"
                      value={newProduct.sku}
                      onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                      className="w-full bg-[#EEECEC]/50 border border-[#EEECEC] rounded-xl p-2.5 text-[#1E1B1C] outline-none focus:border-[#C01E25]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#5C4D50] block mb-1">Wholesale KES</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 14500"
                      value={newProduct.wholesalePriceKES || ''}
                      onChange={(e) => setNewProduct({ ...newProduct, wholesalePriceKES: Number(e.target.value) })}
                      className="w-full bg-[#EEECEC]/50 border border-[#EEECEC] rounded-xl p-2.5 text-[#1E1B1C] outline-none focus:border-[#C01E25]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#5C4D50] block mb-1">Stock Quantity</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 50"
                      value={newProduct.stockCount || ''}
                      onChange={(e) => setNewProduct({ ...newProduct, stockCount: Number(e.target.value) })}
                      className="w-full bg-[#EEECEC]/50 border border-[#EEECEC] rounded-xl p-2.5 text-[#1E1B1C] outline-none focus:border-[#C01E25]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#C01E25] hover:bg-[#a1181e] text-[#FFFFFF] font-bold py-3 rounded-xl transition-colors cursor-pointer"
                >
                  Save & Publish to AI Architecture Engine
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
