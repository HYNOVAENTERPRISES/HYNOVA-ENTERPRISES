import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  ShieldCheck, 
  Wrench, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Navigation, 
  FileText, 
  AlertCircle,
  ExternalLink,
  Phone,
  Sparkles,
  Layers,
  Star
} from 'lucide-react';
import { KENYAN_COUNTIES } from '../data/mockData';
import { GoogleMapsEngineService, LocationCalculationResult } from '../services/googleMapsEngine';
import { calculateVatBreakdown } from '../data/pricingEngine';
import { SiteSurveyRequest, HynovaReceipt, HynovaLocationRecord } from '../types';
import { GoogleMapsLocationPicker } from './GoogleMapsLocationPicker';
import { googleSheetsOps } from '../services/googleSheetsService';
import { getAccessToken } from '../services/authService';

interface SiteSurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCounty?: string;
  initialInterest?: string;
  onSurveyBooked?: (survey: SiteSurveyRequest, receipt: HynovaReceipt) => void;
}

export const SiteSurveyModal: React.FC<SiteSurveyModalProps> = ({
  isOpen,
  onClose,
  initialCounty = 'Nairobi',
  initialInterest = 'Hybrid Solar & CCTV Security',
  onSurveyBooked,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedCounty, setSelectedCounty] = useState(initialCounty.replace(/County/i, '').trim());
  const [addressOrTown, setAddressOrTown] = useState('');
  const [propertyType, setPropertyType] = useState('Residential Villa / Home');
  const [systemInterest, setSystemInterest] = useState(initialInterest);
  const [preferredDate, setPreferredDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [preferredTimeSlot, setPreferredTimeSlot] = useState('Morning (09:00 AM – 12:00 PM)');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmedLocation, setConfirmedLocation] = useState<HynovaLocationRecord | null>(null);

  // Step in survey booking: 1: Parameter & Maps Calculation, 2: M-Pesa Payment, 3: Confirmation
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [mpesaPromptSent, setMpesaPromptSent] = useState(false);
  const [bookedSurvey, setBookedSurvey] = useState<SiteSurveyRequest | null>(null);
  const [generatedReceipt, setGeneratedReceipt] = useState<HynovaReceipt | null>(null);

  // Dynamic Google Maps Logistics Calculation
  const [logistics, setLogistics] = useState<LocationCalculationResult>(() =>
    GoogleMapsEngineService.calculateDeploymentLogistics(
      selectedCounty, 
      addressOrTown, 
      systemInterest, 
      confirmedLocation ? { lat: confirmedLocation.lat, lng: confirmedLocation.lng } : undefined
    )
  );

  useEffect(() => {
    const res = GoogleMapsEngineService.calculateDeploymentLogistics(
      selectedCounty,
      addressOrTown,
      systemInterest,
      confirmedLocation ? { lat: confirmedLocation.lat, lng: confirmedLocation.lng } : undefined
    );
    setLogistics(res);
  }, [selectedCounty, addressOrTown, systemInterest, confirmedLocation]);

  if (!isOpen) return null;

  // Calculate Subtotal & VAT (16%)
  const totalSurveyFee = confirmedLocation?.siteSurveyFeeKES || logistics.siteSurveyFeeKES;
  const subtotalKES = Math.round(totalSurveyFee / 1.16);
  const vatAmountKES = totalSurveyFee - subtotalKES;

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      setFormError('Please provide your name and valid Kenyan phone number.');
      return;
    }
    if (!confirmedLocation) {
      setFormError('Please pin and confirm your exact installation location on the Google Map below before proceeding.');
      return;
    }
    setFormError(null);
    setStep(2);
  };

  const handleSimulateMpesaPayment = () => {
    setIsProcessingPayment(true);
    setMpesaPromptSent(true);

    setTimeout(() => {
      setIsProcessingPayment(false);

      const transCode = `QHY${Math.floor(10000000 + Math.random() * 90000000)}`;
      const receiptNo = `HYN-REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const projectRef = `HYN-PRJ-${Math.floor(1000 + Math.random() * 9000)}`;

      const newSurvey: SiteSurveyRequest = {
        id: `SRV-${Date.now().toString(36)}`,
        customerName,
        customerPhone,
        county: `${selectedCounty} County`,
        addressOrTown: addressOrTown || `${selectedCounty} Central`,
        propertyType,
        systemInterest,
        zone: logistics.zone,
        distanceKm: logistics.technicianDistanceKm,
        surveyFeeKES: subtotalKES,
        vatAmountKES,
        totalFeeKES: totalSurveyFee,
        paymentStatus: 'PAID',
        paymentMethod: 'Safaricom M-Pesa Express',
        mpesaReceiptNumber: transCode,
        assignedTechnician: logistics.matchedTechnician ? {
          id: logistics.matchedTechnician.id,
          name: logistics.matchedTechnician.name,
          phone: logistics.matchedTechnician.phone,
          rank: logistics.matchedTechnician.rank,
          distanceKm: logistics.technicianDistanceKm,
          rating: logistics.matchedTechnician.rating,
        } : undefined,
        surveyStatus: 'SCHEDULED',
        preferredDate,
        preferredTimeSlot,
        notes,
        createdAt: new Date().toISOString(),
        locationRecord: confirmedLocation || undefined,
      };

      const newReceipt: HynovaReceipt = {
        receiptNumber: receiptNo,
        customerName,
        customerPhone,
        projectReference: projectRef,
        itemDescription: `Mandatory Physical Site Survey & Engineering Verification (${logistics.zone})`,
        subtotalKES,
        vatAmountKES,
        amountPaidKES: totalSurveyFee,
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'Safaricom M-Pesa',
        transactionCode: transCode,
        status: 'PAID',
        paymentType: 'SITE_SURVEY_FEE',
      };

      setBookedSurvey(newSurvey);
      setGeneratedReceipt(newReceipt);
      setStep(3);

      // Synchronize directly into authoritative HYNOVA OPS Google Sheets operational layer
      try {
        const addedCustomer = googleSheetsOps.addCustomer({
          purchaserName: customerName,
          purchaserPhone: customerPhone,
          purchaserEmail: '',
          installationRecipient: `${customerName} (Self)`,
          installationLocation: confirmedLocation?.fullAddress || addressOrTown || `${selectedCounty} County`,
          propertyType: propertyType,
        });

        const addedSurvey = googleSheetsOps.addSiteSurvey({
          customerId: addedCustomer.customerId,
          siteLocation: confirmedLocation?.fullAddress || addressOrTown || `${selectedCounty} County`,
          distanceKm: logistics.technicianDistanceKm,
          siteComplexity: 'Standard',
          assessingTechnician: logistics.matchedTechnician ? logistics.matchedTechnician.name : 'Awaiting Assignment',
          engineeringFindingsSummary: `Site assessment confirmed for ${preferredDate} (${preferredTimeSlot}). Focus: ${systemInterest}. Pin: [${confirmedLocation?.lat?.toFixed(4)}, ${confirmedLocation?.lng?.toFixed(4)}]`,
        });

        getAccessToken().then(token => {
          if (token) {
            googleSheetsOps.appendRowToGoogleSheet(
              'Site_Surveys',
              [
                addedSurvey.surveyId,
                addedSurvey.customerId,
                addedSurvey.siteLocation,
                addedSurvey.distanceKm,
                addedSurvey.siteComplexity,
                addedSurvey.surveyFeeKES,
                addedSurvey.assessingTechnician,
                addedSurvey.surveyStatus,
                addedSurvey.engineeringFindingsSummary,
                addedSurvey.associatedJobId
              ],
              token
            ).catch(err => console.warn('Background sheet append note:', err));
          }
        });
      } catch (err) {
        console.warn('Local sheet sync note:', err);
      }

      if (onSurveyBooked) {
        onSurveyBooked(newSurvey, newReceipt);
      }
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="relative bg-[#FFFFFF] rounded-3xl max-w-3xl w-full border border-[#EEECEC] shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EEECEC] bg-[#EEECEC]/30">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#C01E25] bg-[#F0C9CB]/40 px-3 py-1 rounded-full">
              Operating Agreement Section 3
            </span>
            <span className="text-sm font-extrabold text-[#1E1B1C]">
              Mandatory Site Survey Booking
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#5C4D50] hover:text-[#1E1B1C] hover:bg-[#EEECEC] rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Flow Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Progress Indicators */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold border-b border-[#EEECEC] pb-4">
            <div className={`p-2 rounded-xl transition-colors ${step === 1 ? 'bg-[#C01E25] text-white' : 'bg-[#EEECEC] text-[#5C4D50]'}`}>
              1. Location & Survey Specs
            </div>
            <div className={`p-2 rounded-xl transition-colors ${step === 2 ? 'bg-[#C01E25] text-white' : 'bg-[#EEECEC] text-[#5C4D50]'}`}>
              2. M-Pesa Survey Fee
            </div>
            <div className={`p-2 rounded-xl transition-colors ${step === 3 ? 'bg-[#25D366] text-white' : 'bg-[#EEECEC] text-[#5C4D50]'}`}>
              3. Survey Confirmed
            </div>
          </div>

          {/* STEP 1: FORM & GOOGLE MAPS CALCULATION */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Mandatory Policy Banner */}
              <div className="p-4 rounded-2xl bg-[#F0C9CB]/30 border border-[#DB7D81]/40 space-y-1.5 text-xs">
                <div className="flex items-center gap-2 font-black text-[#C01E25]">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>MANDATORY RULE (OPERATING AGREEMENT SECTION 3)</span>
                </div>
                <p className="text-[#1E1B1C] leading-relaxed">
                  Any project requiring physical verification must undergo a site survey. No final quotation shall be issued without a survey.
                  Protects technician time, prevents quotation abuse, and guarantees 100% Bill of Materials precision.
                </p>
                <p className="text-[11px] text-[#5C4D50]">
                  * Site survey fees are non-refundable. At our discretion, the fee may be credited toward your project hardware balance.
                </p>
              </div>

              {/* Form Validation Error Banner */}
              {formError && (
                <div className="bg-[#F0C9CB]/40 border border-[#C01E25] text-[#C01E25] p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Form Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#1E1B1C] block mb-1">
                    Your Full Name <span className="text-[#C01E25]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. David Mwangi"
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-[#EEECEC] focus:border-[#C01E25] outline-none bg-[#EEECEC]/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#1E1B1C] block mb-1">
                    Phone (M-Pesa Express Ready) <span className="text-[#C01E25]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g. 0722 000 000"
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-[#EEECEC] focus:border-[#C01E25] outline-none bg-[#EEECEC]/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#1E1B1C] block mb-1">
                    System Scope to Survey
                  </label>
                  <select
                    value={systemInterest}
                    onChange={(e) => setSystemInterest(e.target.value)}
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-[#EEECEC] focus:border-[#C01E25] outline-none bg-[#EEECEC]/20 cursor-pointer"
                  >
                    <option value="Home Security Essential / CCTV">Home Security (CCTV & Alarms)</option>
                    <option value="Hybrid Solar & Lithium Power Backup">Hybrid Solar & Power Storage</option>
                    <option value="Enterprise Wi-Fi 6 & Starlink">Enterprise Wi-Fi & Starlink</option>
                    <option value="Smart Gate Motor & Biometric Access">Smart Gate Automation & Access</option>
                    <option value="Smart Building IoT & Water Telemetry">Smart Building Automation</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#1E1B1C] block mb-1">
                    Preferred Survey Date
                  </label>
                  <input
                    type="date"
                    value={preferredDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-[#EEECEC] focus:border-[#C01E25] outline-none bg-[#EEECEC]/20 cursor-pointer"
                  />
                </div>
              </div>

              {/* GOOGLE MAPS PRECISE LOCATION PINNING & LOGISTICS COMPONENT */}
              <GoogleMapsLocationPicker
                initialCounty={selectedCounty}
                initialTown={addressOrTown}
                requiredSpecialty={systemInterest}
                showRecipientToggle={true}
                onLocationChange={(loc) => {
                  setConfirmedLocation(loc);
                  setSelectedCounty(loc.county.replace(/County/i, '').trim());
                  setAddressOrTown(loc.fullAddress);
                }}
                onLocationConfirmed={(loc) => {
                  setConfirmedLocation(loc);
                  setSelectedCounty(loc.county.replace(/County/i, '').trim());
                  setAddressOrTown(loc.fullAddress);
                  setStep(2);
                }}
              />

              {/* Submit to Step 2 */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-[#5C4D50]">
                  Survey fee payable securely via Safaricom M-Pesa. Exact coordinates lock prevents site survey rescheduling.
                </div>

                <button
                  type="button"
                  onClick={handleProceedToPayment}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#C01E25] hover:bg-[#a1181e] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-[#C01E25]/25 transition-all cursor-pointer"
                >
                  <span>Proceed to M-Pesa (KES {totalSurveyFee.toLocaleString()})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: M-PESA PAYMENT CONFIRMATION */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center max-w-md mx-auto space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-[#25D366]/20 text-[#128C7E] flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-7 h-7 text-[#25D366]" />
                </div>
                <h3 className="text-xl font-black text-[#1E1B1C]">
                  Pay Mandatory Site Survey Fee
                </h3>
                <p className="text-xs text-[#5C4D50]">
                  Operating Agreement Step 5: Safaricom M-Pesa Escrow Collection
                </p>
              </div>

              {/* Itemized VAT Breakdown (Section 5) */}
              <div className="bg-[#EEECEC]/40 p-5 rounded-2xl border border-[#EEECEC] space-y-3 text-xs">
                <div className="flex items-center justify-between text-[#5C4D50]">
                  <span>Survey Scope:</span>
                  <span className="font-extrabold text-[#1E1B1C]">{systemInterest}</span>
                </div>
                <div className="flex items-center justify-between text-[#5C4D50]">
                  <span>Location & Travel Zone:</span>
                  <span className="font-bold text-[#1E1B1C]">{selectedCounty} • {logistics.zone}</span>
                </div>
                <div className="flex items-center justify-between text-[#5C4D50]">
                  <span>Base Survey Subtotal:</span>
                  <span className="font-bold text-[#1E1B1C]">KES {subtotalKES.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-[#5C4D50]">
                  <span>Kenyan VAT (16%):</span>
                  <span className="font-bold text-[#C01E25]">KES {vatAmountKES.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#EEECEC] text-sm font-black text-[#1E1B1C]">
                  <span>Total Payable:</span>
                  <span className="text-[#C01E25] text-base">KES {totalSurveyFee.toLocaleString()}</span>
                </div>
              </div>

              {/* M-Pesa STK Push Box */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#25D366]/15 via-white to-[#25D366]/10 border border-[#25D366]/40 space-y-4 text-center">
                <div>
                  <span className="text-xs font-bold text-[#128C7E] uppercase tracking-wider block">
                    Safaricom M-Pesa Express STK Push
                  </span>
                  <p className="text-xs text-[#5C4D50] mt-1">
                    An instant payment prompt will be sent to <strong>{customerPhone}</strong> for <strong>KES {totalSurveyFee.toLocaleString()}</strong>.
                  </p>
                </div>

                {isProcessingPayment ? (
                  <div className="p-4 rounded-xl bg-white border border-[#25D366] text-xs font-bold text-[#128C7E] flex items-center justify-center gap-2 animate-pulse">
                    <Clock className="w-4 h-4 animate-spin text-[#128C7E]" />
                    <span>Sending M-Pesa STK Push to {customerPhone}... Please enter PIN</span>
                  </div>
                ) : (
                  <button
                    onClick={handleSimulateMpesaPayment}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/25 transition-all cursor-pointer mx-auto"
                  >
                    <span>Send M-Pesa STK Prompt (KES {totalSurveyFee.toLocaleString()})</span>
                  </button>
                )}

                <div className="text-[11px] text-[#5C4D50] pt-2">
                  Or pay via Paybill: <strong>400200</strong> • Account: <strong>HYN-{customerPhone.slice(-4)}</strong>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-[#5C4D50] hover:text-[#1E1B1C] font-bold cursor-pointer"
                >
                  ← Edit Survey Details
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: CONFIRMATION & RECEIPT READY */}
          {step === 3 && bookedSurvey && generatedReceipt && (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 rounded-full bg-[#25D366]/20 text-[#128C7E] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-[#25D366]" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-[#C01E25] uppercase tracking-wider">
                  Booking Confirmed & Tax Receipt Issued
                </span>
                <h3 className="text-2xl font-black text-[#1E1B1C]">
                  Certified Site Survey Scheduled!
                </h3>
                <p className="text-xs text-[#5C4D50] max-w-md mx-auto">
                  Payment of <strong>KES {totalSurveyFee.toLocaleString()}</strong> verified. Receipt <strong>#{generatedReceipt.receiptNumber}</strong> generated.
                </p>
              </div>

              {/* Lead Technician Card */}
              {logistics.matchedTechnician ? (
                <div className="bg-[#EEECEC]/40 p-4 rounded-2xl border border-[#EEECEC] text-xs text-left max-w-md mx-auto flex items-center gap-3">
                  <img
                    src={logistics.matchedTechnician.avatar}
                    alt={logistics.matchedTechnician.name}
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-[#C01E25] shrink-0"
                  />
                  <div>
                    <span className="text-[10px] text-[#8F7B7F] uppercase font-bold block">Assigned Lead Technician</span>
                    <div className="font-extrabold text-sm text-[#1E1B1C]">{logistics.matchedTechnician.name}</div>
                    <div className="text-[#5C4D50]">
                      Scheduled: <strong>{preferredDate} ({preferredTimeSlot})</strong>
                    </div>
                    <div className="text-[#C01E25] font-bold text-[11px] mt-0.5">
                      Direct Line: {logistics.matchedTechnician.phone}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-[#EEECEC]/40 p-4 rounded-2xl border border-[#EEECEC] text-xs text-left max-w-md mx-auto flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#C01E25]/10 text-[#C01E25] border-2 border-[#C01E25] shrink-0 flex items-center justify-center font-black text-sm">
                    HYN
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8F7B7F] uppercase font-bold block">Field Technician Status</span>
                    <div className="font-extrabold text-sm text-[#1E1B1C]">Awaiting Technician Assignment</div>
                    <div className="text-[#5C4D50]">
                      Preferred Slot: <strong>{preferredDate} ({preferredTimeSlot})</strong>
                    </div>
                    <div className="text-emerald-700 font-bold text-[11px] mt-0.5">
                      Our dispatch coordinator will contact {customerPhone}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#C01E25] hover:bg-[#a1181e] text-white font-bold text-xs cursor-pointer shadow-md transition-colors"
                >
                  Done & View Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
