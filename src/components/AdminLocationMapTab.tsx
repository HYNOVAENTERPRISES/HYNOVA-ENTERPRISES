/// <reference types="@types/google.maps" />
import React, { useState, useEffect, useMemo } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMap,
} from '@vis.gl/react-google-maps';
import {
  MapPin,
  Navigation,
  Search,
  Crosshair,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Car,
  Layers,
  Building,
  User,
  Phone,
  ExternalLink,
  RefreshCw,
  Sliders,
  Sparkles,
  ChevronRight,
  Filter
} from 'lucide-react';
import { 
  HynovaLocationRecord, 
  TechnicianRank 
} from '../types';
import { 
  GoogleMapsEngineService, 
  HYNOVA_REGIONAL_HUBS, 
  GeoCoordinate 
} from '../services/googleMapsEngine';
import { InteractiveKenyaTileMap } from './InteractiveKenyaTileMap';

// Default seed records for administrative demonstration and operations dispatch
const SEED_OPERATIONAL_RECORDS: HynovaLocationRecord[] = [
  {
    id: 'LOC-HYN-902144',
    customerId: 'CUST-0842',
    quoteId: 'QTE-HYN-2026-4412',
    orderId: 'ORD-HYN-7819',
    jobId: 'JOB-HYN-3301',
    dispatchId: 'DSP-HYN-1104',
    lat: -1.2642,
    lng: 36.8045,
    googlePlaceId: 'ChIJgTwAaD8RLxgRxx-m_37fAaw',
    fullAddress: 'Woodvale Grove, Westlands, Nairobi County, Kenya',
    county: 'Nairobi County',
    subCounty: 'Westlands',
    townOrArea: 'Westlands CBD',
    timestamp: '2026-09-28T07:15:00Z',
    permissionStatus: 'GRANTED',
    source: 'GPS_CURRENT_LOCATION',
    confidenceScore: 100,
    confidenceLabel: 'GPS Confirmed (100% Confidence)',
    surveyRecommendation: 'WAIVED_ELIGIBLE',
    surveyReason: 'High-precision native GPS coordinate lock obtained directly from customer rooftop device.',
    isDifferentInstallationLocation: false,
    distanceFromZoneKm: 4.2,
    nearestZoneName: 'Nairobi Central & Metro Hub',
    distanceFromTechnicianKm: 3.5,
    nearestTechnicianId: 'tech-001',
    nearestTechnicianName: 'Brian Mwangi Kibet',
    nearestTechnicianRank: 'Specialist Technician',
    estimatedTravelKm: 3.5,
    estimatedTravelTimeMinutes: 18,
    serviceZoneTier: 'Zone A (0–15 KM)',
    travelChargesKES: 0,
    siteSurveyFeeKES: 1000,
    logisticsMultiplier: 1.0,
    maintenanceVisitCostKES: 2500,
    confirmedByCustomer: true,
    confirmedAt: '2026-09-28T07:16:20Z',
  },
  {
    id: 'LOC-HYN-845112',
    customerId: 'CUST-0915',
    quoteId: 'QTE-HYN-2026-4415',
    orderId: 'ORD-HYN-7822',
    lat: -1.4392,
    lng: 36.9668,
    googlePlaceId: 'ChIJh8n4rF3_LxgROuI3895sBAQ',
    fullAddress: 'Mombasa Road Corridor, Syokimau / Athi River, Machakos County, Kenya',
    county: 'Machakos County',
    subCounty: 'Mavoko (Athi River / Syokimau)',
    townOrArea: 'Syokimau Gate 2',
    timestamp: '2026-09-28T06:40:00Z',
    permissionStatus: 'MANUAL',
    source: 'SEARCH_AUTOCOMPLETE',
    confidenceScore: 95,
    confidenceLabel: 'Google Maps Address Match (95% Confidence)',
    surveyRecommendation: 'OPTIONAL',
    surveyReason: 'Verified Google Maps Place ID and street address match in Google Maps directory.',
    isDifferentInstallationLocation: true,
    recipientContact: {
      recipientName: 'Grace Muthoni (Site Engineer)',
      recipientPhone: '+254 721 984 551',
      recipientRelationship: 'Site Manager',
      siteAccessInstructions: 'Opposite Gateway Mall, access via Service Lane Gate C.',
    },
    distanceFromZoneKm: 18.4,
    nearestZoneName: 'Nairobi Central & Metro Hub',
    distanceFromTechnicianKm: 2.1,
    nearestTechnicianId: 'tech-002',
    nearestTechnicianName: 'Dennis Ochieng Otieno',
    nearestTechnicianRank: 'Master Technician',
    estimatedTravelKm: 2.1,
    estimatedTravelTimeMinutes: 12,
    serviceZoneTier: 'Zone B (15–40 KM)',
    travelChargesKES: 150,
    siteSurveyFeeKES: 2000,
    logisticsMultiplier: 1.08,
    maintenanceVisitCostKES: 3800,
    confirmedByCustomer: true,
    confirmedAt: '2026-09-28T06:42:00Z',
  },
  {
    id: 'LOC-HYN-773429',
    customerId: 'CUST-0720',
    quoteId: 'QTE-HYN-2026-4390',
    siteSurveyId: 'SRV-HYN-5510',
    lat: -0.2852,
    lng: 36.0712,
    googlePlaceId: 'ChIJZ4zS0L5yLxgR5T0j-hE3q3k',
    fullAddress: 'Milimani Estate, Nakuru Town West, Nakuru County, Kenya',
    county: 'Nakuru County',
    subCounty: 'Nakuru Town West',
    townOrArea: 'Milimani Heights',
    timestamp: '2026-09-27T18:20:00Z',
    permissionStatus: 'MANUAL',
    source: 'MANUAL_MAP_PIN',
    confidenceScore: 85,
    confidenceLabel: 'Landmark / Visual Pin Placement (85%)',
    surveyRecommendation: 'RECOMMENDED',
    surveyReason: 'Customer visually dropped pin on Google Maps. Site survey recommended to verify exact cable pathways and structural mounting.',
    isDifferentInstallationLocation: false,
    distanceFromZoneKm: 3.2,
    nearestZoneName: 'Central Rift Regional Hub',
    distanceFromTechnicianKm: 4.1,
    nearestTechnicianId: 'tech-005',
    nearestTechnicianName: 'Samuel Kiprop Cheruiyot',
    nearestTechnicianRank: 'Senior Technician',
    estimatedTravelKm: 4.1,
    estimatedTravelTimeMinutes: 20,
    serviceZoneTier: 'Zone A (0–15 KM)',
    travelChargesKES: 0,
    siteSurveyFeeKES: 1000,
    logisticsMultiplier: 1.0,
    maintenanceVisitCostKES: 2500,
    confirmedByCustomer: true,
    confirmedAt: '2026-09-27T18:22:15Z',
  },
  {
    id: 'LOC-HYN-619082',
    customerId: 'CUST-0688',
    quoteId: 'QTE-HYN-2026-4355',
    siteSurveyId: 'SRV-HYN-5498',
    lat: -4.0321,
    lng: 39.7154,
    googlePlaceId: 'ChIJV4qPZ81XLBgRKn24sWw-uQE',
    fullAddress: 'Links Road, Nyali Beach Corridor, Mombasa County, Kenya',
    county: 'Mombasa County',
    subCounty: 'Nyali',
    townOrArea: 'Nyali Phase 1',
    timestamp: '2026-09-27T14:10:00Z',
    permissionStatus: 'GRANTED',
    source: 'GPS_CURRENT_LOCATION',
    confidenceScore: 100,
    confidenceLabel: 'GPS Confirmed (100% Confidence)',
    surveyRecommendation: 'WAIVED_ELIGIBLE',
    surveyReason: 'High-precision native GPS coordinate lock obtained directly from customer device.',
    isDifferentInstallationLocation: false,
    distanceFromZoneKm: 5.8,
    nearestZoneName: 'Coast Regional Hub',
    distanceFromTechnicianKm: 2.8,
    nearestTechnicianId: 'tech-004',
    nearestTechnicianName: 'Hamisi Bakari Mwatela',
    nearestTechnicianRank: 'Master Technician',
    estimatedTravelKm: 2.8,
    estimatedTravelTimeMinutes: 15,
    serviceZoneTier: 'Zone A (0–15 KM)',
    travelChargesKES: 0,
    siteSurveyFeeKES: 1000,
    logisticsMultiplier: 1.0,
    maintenanceVisitCostKES: 2500,
    confirmedByCustomer: true,
    confirmedAt: '2026-09-27T14:12:00Z',
  },
  {
    id: 'LOC-HYN-501233',
    customerId: 'CUST-0599',
    quoteId: 'QTE-HYN-2026-4310',
    lat: -0.0924,
    lng: 34.7621,
    googlePlaceId: 'ChIJ42K5R1h_MxgRuvG2eXlAqw8',
    fullAddress: 'Off Ring Road, Milimani, Kisumu County, Kenya',
    county: 'Kisumu County',
    subCounty: 'Kisumu Central',
    townOrArea: 'Milimani / Tom Mboya',
    timestamp: '2026-09-27T11:00:00Z',
    permissionStatus: 'MANUAL',
    source: 'SEARCH_AUTOCOMPLETE',
    confidenceScore: 95,
    confidenceLabel: 'Google Maps Address Match (95% Confidence)',
    surveyRecommendation: 'OPTIONAL',
    surveyReason: 'Verified Google Maps Place ID and street address match in Google Maps directory.',
    isDifferentInstallationLocation: false,
    distanceFromZoneKm: 2.5,
    nearestZoneName: 'Western & Lake Basin Hub',
    distanceFromTechnicianKm: 1.9,
    nearestTechnicianId: 'tech-006',
    nearestTechnicianName: 'Kennedy Omondi Aloo',
    nearestTechnicianRank: 'Specialist Technician',
    estimatedTravelKm: 1.9,
    estimatedTravelTimeMinutes: 10,
    serviceZoneTier: 'Zone A (0–15 KM)',
    travelChargesKES: 0,
    siteSurveyFeeKES: 1000,
    logisticsMultiplier: 1.0,
    maintenanceVisitCostKES: 2500,
    confirmedByCustomer: true,
    confirmedAt: '2026-09-27T11:02:30Z',
  },
];

// Helper to center the map when a record is selected
const AdminMapCenterController: React.FC<{ coords: GeoCoordinate; zoom: number }> = ({ coords, zoom }) => {
  const map = useMap();

  useEffect(() => {
    if (map) {
      map.panTo(coords);
      map.setZoom(zoom);
    }
  }, [map, coords, zoom]);

  return null;
};

export const AdminLocationMapTab: React.FC = () => {
  const apiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyAAwaPM3xLQrgvFDga5BSEq3lCd1HftD7s';

  // Load records from local storage or use seeds
  const [records, setRecords] = useState<HynovaLocationRecord[]>(() => {
    const stored = GoogleMapsEngineService.getAllLocationRecords();
    if (stored && stored.length > 0) {
      // Merge unique with seeds
      const combined = [...stored];
      for (const s of SEED_OPERATIONAL_RECORDS) {
        if (!combined.some((r) => r.id === s.id)) {
          combined.push(s);
        }
      }
      return combined;
    }
    return SEED_OPERATIONAL_RECORDS;
  });

  const [selectedRecordId, setSelectedRecordId] = useState<string>(records[0]?.id || '');
  const [filterType, setFilterType] = useState<'all' | 'quotes' | 'orders' | 'surveys' | 'jobs'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [mapTypeId, setMapTypeId] = useState<'roadmap' | 'hybrid'>('roadmap');
  const [isBillingError, setIsBillingError] = useState<boolean>(false);

  useEffect(() => {
    const handleAuthFailure = () => {
      setIsBillingError(true);
    };

    const handleWindowError = (e: ErrorEvent) => {
      const msg = e.message || '';
      if (
        msg.includes('BillingNotEnabledMapError') ||
        msg.includes('billing/enable') ||
        msg.includes('Places API error')
      ) {
        e.preventDefault();
        setIsBillingError(true);
      }
    };

    (window as any).gm_authFailure = handleAuthFailure;
    window.addEventListener('error', handleWindowError);

    return () => {
      window.removeEventListener('error', handleWindowError);
    };
  }, []);

  // Selected record object
  const selectedRecord = useMemo(() => {
    return records.find((r) => r.id === selectedRecordId) || records[0];
  }, [records, selectedRecordId]);

  // Current map center & zoom
  const currentCoords: GeoCoordinate = useMemo(() => {
    if (selectedRecord) {
      return { lat: selectedRecord.lat, lng: selectedRecord.lng };
    }
    return { lat: -1.286389, lng: 36.817223 }; // Nairobi default
  }, [selectedRecord]);

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // Type match
      let matchType = true;
      if (filterType === 'quotes') matchType = !!r.quoteId;
      if (filterType === 'orders') matchType = !!r.orderId;
      if (filterType === 'surveys') matchType = !!r.siteSurveyId;
      if (filterType === 'jobs') matchType = !!r.jobId || !!r.dispatchId;

      // Query match
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        r.id.toLowerCase().includes(q) ||
        r.fullAddress.toLowerCase().includes(q) ||
        r.county.toLowerCase().includes(q) ||
        (r.recipientContact?.recipientName || '').toLowerCase().includes(q) ||
        r.nearestTechnicianName.toLowerCase().includes(q);

      return matchType && matchSearch;
    });
  }, [records, filterType, searchQuery]);

  const handleRefresh = () => {
    const stored = GoogleMapsEngineService.getAllLocationRecords();
    if (stored && stored.length > 0) {
      const combined = [...stored];
      for (const s of SEED_OPERATIONAL_RECORDS) {
        if (!combined.some((r) => r.id === s.id)) {
          combined.push(s);
        }
      }
      setRecords(combined);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Stats Ribbon */}
      <div className="bg-white rounded-3xl border border-[#EEECEC] p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#C01E25] bg-[#F0C9CB]/40 px-3 py-1 rounded-full mb-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>Operations & Field Dispatch Console</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#1E1B1C]">
              Google Maps Location Telemetry & Technician Routing
            </h2>
            <p className="text-xs text-[#5C4D50]">
              Real-time pinned installation locations across all 47 Kenyan counties for precise logistics, distance pricing, and dispatch routing.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="px-3.5 py-2 rounded-xl bg-[#EEECEC] hover:bg-[#DDDADA] text-[#1E1B1C] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#C01E25]" />
              <span>Refresh Records</span>
            </button>

            <button
              onClick={() => setMapTypeId(mapTypeId === 'roadmap' ? 'hybrid' : 'roadmap')}
              className="px-3.5 py-2 rounded-xl bg-[#EEECEC] hover:bg-[#DDDADA] text-[#1E1B1C] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-[#5C4D50]" />
              <span>{mapTypeId === 'roadmap' ? 'Satellite' : 'Roadmap'}</span>
            </button>
          </div>
        </div>

        {/* 4 Quick Operational Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 bg-[#EEECEC]/40 rounded-2xl border border-[#EEECEC]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5C4D50] block">Active Pinned Sites</span>
            <div className="text-2xl font-black text-[#1E1B1C] mt-0.5">{records.length}</div>
            <span className="text-[11px] text-emerald-600 font-bold">100% Pinned Accuracy</span>
          </div>

          <div className="p-3 bg-[#EEECEC]/40 rounded-2xl border border-[#EEECEC]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5C4D50] block">Average Hub Distance</span>
            <div className="text-2xl font-black text-[#C01E25] mt-0.5">
              {(records.reduce((acc, r) => acc + r.distanceFromZoneKm, 0) / (records.length || 1)).toFixed(1)} KM
            </div>
            <span className="text-[11px] text-[#5C4D50]">Across 6 Regional Hubs</span>
          </div>

          <div className="p-3 bg-[#EEECEC]/40 rounded-2xl border border-[#EEECEC]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5C4D50] block">GPS Confirmed (100%)</span>
            <div className="text-2xl font-black text-[#128C7E] mt-0.5">
              {records.filter((r) => r.confidenceScore === 100).length}
            </div>
            <span className="text-[11px] text-[#128C7E]">Waived Survey Eligible</span>
          </div>

          <div className="p-3 bg-[#EEECEC]/40 rounded-2xl border border-[#EEECEC]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5C4D50] block">Separate Recipients</span>
            <div className="text-2xl font-black text-[#1E1B1C] mt-0.5">
              {records.filter((r) => r.isDifferentInstallationLocation).length}
            </div>
            <span className="text-[11px] text-[#5C4D50]">On-Site Caretaker Pinned</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Map + Records List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (7 cols): Interactive Google Map & Selected Location Card */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl border border-[#EEECEC] p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-[#1E1B1C] flex items-center gap-1.5">
                <Navigation className="w-4 h-4 text-[#C01E25]" />
                <span>Kenya Field Dispatch & Installation Sites Map</span>
              </span>
              <span className="text-[11px] text-[#5C4D50] font-semibold">
                Click any marker to inspect routing
              </span>
            </div>

            {/* Google Cloud Project Billing Notice (shown if BillingNotEnabledMapError occurs) */}
            {isBillingError && (
              <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-300 text-amber-900 text-xs space-y-1.5 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-black text-amber-950">
                    <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>Google Cloud Billing Activation Required</span>
                  </div>
                  <span className="text-[10px] font-mono bg-amber-200/80 px-2 py-0.5 rounded text-amber-950 font-bold">
                    BillingNotEnabledMapError
                  </span>
                </div>
                <p className="text-[11px] text-amber-900">
                  Google Maps Platform requires billing to be enabled on your Google Cloud project. Enable billing at{' '}
                  <a
                    href="https://console.cloud.google.com/project/_/billing/enable"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-extrabold text-[#C01E25] underline hover:text-[#a1181e]"
                  >
                    console.cloud.google.com/project/_/billing/enable
                  </a>.
                </p>
                <div className="text-[11px] text-emerald-800 font-bold bg-white/70 p-2 rounded-xl border border-amber-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Interactive Field Dispatch Map is fully operational in fallback mode below.</span>
                </div>
              </div>
            )}

            {/* Google Map or InteractiveKenyaTileMap Fallback */}
            {isBillingError ? (
              <InteractiveKenyaTileMap
                coords={currentCoords}
                zoom={13}
                mapTypeId={mapTypeId}
                onCoordsChange={(newCoords) => {
                  if (selectedRecord) {
                    const updated = { ...selectedRecord, lat: newCoords.lat, lng: newCoords.lng };
                    setRecords(records.map(r => r.id === updated.id ? updated : r));
                  }
                }}
                className="w-full h-[420px] sm:h-[480px]"
              />
            ) : (
              <div className="w-full h-[420px] sm:h-[480px] rounded-2xl overflow-hidden border border-[#EEECEC] shadow-inner relative">
                <APIProvider 
                  apiKey={apiKey}
                  onError={() => setIsBillingError(true)}
                >
                  <Map
                    mapId="DEMO_MAP_ID"
                    internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                    defaultCenter={currentCoords}
                    center={currentCoords}
                    defaultZoom={13}
                    mapTypeId={mapTypeId}
                    gestureHandling="greedy"
                    disableDefaultUI={false}
                    zoomControl={true}
                    style={{ width: '100%', height: '100%' }}
                  >
                    <AdminMapCenterController coords={currentCoords} zoom={14} />

                    {/* Render 6 Regional Hub Markers */}
                    {HYNOVA_REGIONAL_HUBS.map((hub) => (
                      <AdvancedMarker
                        key={hub.id}
                        position={hub.coordinates}
                        title={`HYNOVA Hub: ${hub.name}`}
                      >
                        <div className="flex flex-col items-center">
                          <div className="bg-[#1E1B1C] text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow whitespace-nowrap">
                            {hub.hubCity} Hub
                          </div>
                          <div className="w-6 h-6 rounded-full bg-[#1E1B1C] text-white border border-white flex items-center justify-center shadow-md">
                            <Building className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </AdvancedMarker>
                    ))}

                    {/* Render Customer Pinned Location Markers */}
                    {filteredRecords.map((r) => {
                      const isSelected = r.id === selectedRecordId;
                      return (
                        <AdvancedMarker
                          key={r.id}
                          position={{ lat: r.lat, lng: r.lng }}
                          onClick={() => setSelectedRecordId(r.id)}
                          title={`${r.id}: ${r.fullAddress}`}
                        >
                          <div className={`flex flex-col items-center group cursor-pointer transition-transform ${isSelected ? 'scale-110 z-30' : 'hover:scale-105'}`}>
                            <div className={`text-[9px] font-black px-1.5 py-0.5 rounded shadow whitespace-nowrap border text-white ${
                              isSelected ? 'bg-[#C01E25] border-white' : 'bg-[#1E1B1C] border-[#EEECEC]'
                            }`}>
                              {r.id.split('-').slice(1).join('-')}
                            </div>
                            <div className={`w-7 h-7 rounded-full border-2 border-white shadow-xl flex items-center justify-center ${
                              isSelected ? 'bg-[#C01E25] text-white ring-2 ring-[#C01E25]' : 'bg-[#C01E25] text-white'
                            }`}>
                              <MapPin className="w-4 h-4 fill-current" />
                            </div>
                          </div>
                        </AdvancedMarker>
                      );
                    })}
                  </Map>
                </APIProvider>
              </div>
            )}
          </div>

          {/* Selected Record Operational Detail Drawer */}
          {selectedRecord && (
            <div className="bg-white rounded-3xl border-2 border-[#C01E25]/30 p-5 shadow-xs space-y-4 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EEECEC] pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-black text-[#C01E25] bg-[#F0C9CB]/40 px-2.5 py-0.5 rounded-lg">
                      {selectedRecord.id}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      selectedRecord.confidenceScore >= 95
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {selectedRecord.confidenceLabel}
                    </span>
                  </div>
                  <h3 className="text-sm font-extrabold text-[#1E1B1C] mt-1">
                    {selectedRecord.fullAddress}
                  </h3>
                </div>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent('-1.286389,36.817223')}&destination=${encodeURIComponent(`${selectedRecord.lat},${selectedRecord.lng}`)}&travelmode=driving`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-[#C01E25] hover:bg-[#a1181e] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-sm"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Open Directions</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>
              </div>

              {/* Coordinates and Distance Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 bg-[#EEECEC]/40 rounded-xl border border-[#EEECEC]">
                  <span className="text-[10px] font-bold uppercase text-[#5C4D50] block">GPS Coordinates</span>
                  <span className="font-mono font-bold text-[#1E1B1C] block text-[11px] truncate">
                    {selectedRecord.lat.toFixed(5)}, {selectedRecord.lng.toFixed(5)}
                  </span>
                  <span className="text-[10px] text-[#5C4D50]">Google Maps Precision</span>
                </div>

                <div className="p-2.5 bg-[#EEECEC]/40 rounded-xl border border-[#EEECEC]">
                  <span className="text-[10px] font-bold uppercase text-[#5C4D50] block">Hub Proximity</span>
                  <span className="font-bold text-[#C01E25] block text-[11px] truncate">
                    {selectedRecord.distanceFromZoneKm} KM
                  </span>
                  <span className="text-[10px] text-[#5C4D50] truncate block">{selectedRecord.nearestZoneName}</span>
                </div>

                <div className="p-2.5 bg-[#EEECEC]/40 rounded-xl border border-[#EEECEC]">
                  <span className="text-[10px] font-bold uppercase text-[#5C4D50] block">Assigned Tech</span>
                  <span className="font-bold text-[#1E1B1C] block text-[11px] truncate">
                    {selectedRecord.nearestTechnicianName}
                  </span>
                  <span className="text-[10px] text-[#128C7E] block">{selectedRecord.distanceFromTechnicianKm} km away</span>
                </div>

                <div className="p-2.5 bg-[#EEECEC]/40 rounded-xl border border-[#EEECEC]">
                  <span className="text-[10px] font-bold uppercase text-[#5C4D50] block">Survey Status</span>
                  <span className="font-bold text-[#C01E25] block text-[11px]">
                    {selectedRecord.surveyRecommendation === 'WAIVED_ELIGIBLE' ? 'Waived (Online)' : 'Survey Required'}
                  </span>
                  <span className="text-[10px] text-[#5C4D50]">Fee: KES {selectedRecord.siteSurveyFeeKES.toLocaleString()}</span>
                </div>
              </div>

              {/* Recipient Details if installation is for another person/property */}
              {selectedRecord.isDifferentInstallationLocation && selectedRecord.recipientContact && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-[#1E1B1C] space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900">
                    <User className="w-3.5 h-3.5 text-amber-700" />
                    <span>On-Site Caretaker / Recipient Contact:</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-amber-950">
                    <span><strong>Name:</strong> {selectedRecord.recipientContact.recipientName}</span>
                    <span><strong>Phone:</strong> {selectedRecord.recipientContact.recipientPhone}</span>
                    <span><strong>Role:</strong> {selectedRecord.recipientContact.recipientRelationship || 'Caretaker'}</span>
                  </div>
                  {selectedRecord.recipientContact.siteAccessInstructions && (
                    <div className="text-[11px] text-amber-800 italic">
                      Instructions: {selectedRecord.recipientContact.siteAccessInstructions}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column (5 cols): Filterable Records List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-white rounded-3xl border border-[#EEECEC] p-5 shadow-xs space-y-4">
            
            {/* Filter and Search Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-[#1E1B1C]">
                  Operational Records ({filteredRecords.length})
                </span>
                <span className="text-[11px] text-[#5C4D50]">
                  Linked to Quotes & Orders
                </span>
              </div>

              {/* Search input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-[#5C4D50]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by address, county, ID or tech..."
                  className="w-full pl-8 pr-3 py-2 text-xs bg-[#EEECEC]/40 rounded-xl border border-[#EEECEC] focus:outline-none focus:ring-1 focus:ring-[#C01E25]"
                />
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                {[
                  { id: 'all', label: 'All Sites' },
                  { id: 'quotes', label: 'Quotes' },
                  { id: 'orders', label: 'Orders' },
                  { id: 'surveys', label: 'Surveys' },
                  { id: 'jobs', label: 'Jobs' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFilterType(f.id as any)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer whitespace-nowrap ${
                      filterType === f.id
                        ? 'bg-[#C01E25] text-white'
                        : 'bg-[#EEECEC]/70 text-[#5C4D50] hover:bg-[#EEECEC]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Records List Scrollable Container */}
            <div className="space-y-2.5 max-h-[560px] overflow-y-auto pr-1">
              {filteredRecords.map((r) => {
                const isSelected = r.id === selectedRecordId;
                return (
                  <div
                    key={r.id}
                    onClick={() => setSelectedRecordId(r.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#C01E25] bg-[#F0C9CB]/20 ring-1 ring-[#C01E25]'
                        : 'border-[#EEECEC] bg-white hover:bg-[#EEECEC]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#C01E25]" />
                        <span className="text-xs font-mono font-bold text-[#1E1B1C]">{r.id}</span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        r.confidenceScore >= 95 ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {r.confidenceScore}% Score
                      </span>
                    </div>

                    <div className="text-xs font-bold text-[#1E1B1C] line-clamp-1 mb-1">
                      {r.fullAddress}
                    </div>

                    <div className="grid grid-cols-2 gap-1 text-[11px] text-[#5C4D50] pt-1 border-t border-[#EEECEC]">
                      <div>
                        <strong>Hub:</strong> {r.distanceFromZoneKm} km
                      </div>
                      <div>
                        <strong>Tech:</strong> {r.nearestTechnicianName.split(' ')[0]} ({r.distanceFromTechnicianKm} km)
                      </div>
                    </div>

                    {r.isDifferentInstallationLocation && (
                      <div className="mt-1.5 text-[10px] text-[#C01E25] font-semibold flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>Recipient: {r.recipientContact?.recipientName}</span>
                      </div>
                    )}
                  </div>
                );
              })}

              {filteredRecords.length === 0 && (
                <div className="p-8 text-center text-xs text-[#5C4D50]">
                  No location records matching your search filter.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
