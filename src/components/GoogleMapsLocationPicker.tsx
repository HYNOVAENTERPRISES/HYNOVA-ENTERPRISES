/// <reference types="@types/google.maps" />
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import {
  MapPin,
  Search,
  Crosshair,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Layers,
  Sparkles,
  Building,
  User,
  Phone,
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import { 
  HynovaLocationRecord, 
  LocationPermissionStatus, 
  LocationSource, 
  LocationRecipientContact 
} from '../types';
import { 
  GoogleMapsEngineService, 
  KENYA_COUNTY_COORDINATES, 
  GeoCoordinate 
} from '../services/googleMapsEngine';
import { KENYAN_COUNTIES } from '../data/mockData';
import { InteractiveKenyaTileMap } from './InteractiveKenyaTileMap';
import { FEATURE_FLAGS } from '../config/features';

interface GoogleMapsLocationPickerProps {
  initialCounty?: string;
  initialSubCounty?: string;
  initialTown?: string;
  requiredSpecialty?: string;
  onLocationConfirmed: (location: HynovaLocationRecord) => void;
  onLocationChange?: (location: HynovaLocationRecord) => void;
  title?: string;
  subtitle?: string;
  showRecipientToggle?: boolean;
}

// Controller component to smoothly center and re-pan the Google Map when restored
const MapCenterController: React.FC<{ coords: GeoCoordinate; zoom: number }> = ({ coords, zoom }) => {
  const map = useMap();

  useEffect(() => {
    if (map) {
      map.panTo(coords);
      map.setZoom(zoom);
    }
  }, [map, coords, zoom]);

  return null;
};

// Search Box component preserved for when Google Maps is restored
interface PlaceSearchBoxProps {
  onPlaceSelected: (place: google.maps.places.PlaceResult) => void;
  onManualSearch: (query: string) => void;
  countyHint: string;
  isBillingError?: boolean;
}

const PlaceSearchBox: React.FC<PlaceSearchBoxProps> = ({ onPlaceSelected, onManualSearch, countyHint, isBillingError = false }) => {
  const [query, setQuery] = useState('');
  const placesLib = useMapsLibrary('places');
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (!placesLib || !inputRef.current || isBillingError) return;

    try {
      const autocomplete = new placesLib.Autocomplete(inputRef.current, {
        componentRestrictions: { country: 'ke' },
        fields: ['geometry', 'name', 'formatted_address', 'place_id', 'address_components'],
      });

      autocomplete.addListener('place_changed', () => {
        try {
          const place = autocomplete.getPlace();
          if (place && place.geometry && place.geometry.location) {
            onPlaceSelected(place);
          }
        } catch {
          // Autocomplete event handled safely
        }
      });

      autocompleteRef.current = autocomplete;
    } catch {
      // Caught in case Places API is unavailable
    }
  }, [placesLib, onPlaceSelected, isBillingError]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (query.trim()) {
      onManualSearch(query.trim());
    }
  };

  return (
    <div className="relative flex items-center">
      <div className="absolute left-3 text-[#5C4D50] pointer-events-none">
        <Search className="w-4 h-4 text-[#C01E25]" />
      </div>
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={`Search landmark, road, building or estate in ${countyHint}...`}
        className="w-full pl-9 pr-20 py-2.5 rounded-xl bg-white text-xs sm:text-sm font-medium text-[#1E1B1C] border border-[#EEECEC] shadow-xs focus:outline-none focus:ring-2 focus:ring-[#C01E25]"
      />
      <button
        type="button"
        onClick={() => handleSubmit()}
        className="absolute right-1.5 px-3 py-1 bg-[#1E1B1C] hover:bg-[#C01E25] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
      >
        Find
      </button>
    </div>
  );
};

export const GoogleMapsLocationPicker: React.FC<GoogleMapsLocationPickerProps> = ({
  initialCounty = 'Nairobi County',
  initialSubCounty = '',
  initialTown = '',
  requiredSpecialty = 'Solar & Security',
  onLocationConfirmed,
  onLocationChange,
  title = 'Installation location',
  subtitle = 'Tell us where you need the installation, or share your location with us on WhatsApp so we can understand your project requirements.',
  showRecipientToggle = true,
}) => {
  // Check feature flag for Google Maps and Geolocation
  const isMapsEnabled = FEATURE_FLAGS.ENABLE_GOOGLE_MAPS_LOCATION_PICKER;

  const [selectedCounty, setSelectedCounty] = useState<string>(initialCounty);
  const normalizedCounty = GoogleMapsEngineService.normalizeCounty(selectedCounty);
  const subCounties = GoogleMapsEngineService.getSubCounties(normalizedCounty);
  const [selectedSubCounty, setSelectedSubCounty] = useState<string>(initialSubCounty || subCounties[0] || '');
  const [townOrArea, setTownOrArea] = useState<string>(initialTown);

  const defaultCoords = KENYA_COUNTY_COORDINATES[normalizedCounty] || KENYA_COUNTY_COORDINATES['Nairobi'];
  const [currentCoords, setCurrentCoords] = useState<GeoCoordinate>({
    lat: defaultCoords.lat,
    lng: defaultCoords.lng,
  });

  const [fullAddress, setFullAddress] = useState<string>(
    initialTown 
      ? `${initialTown}, ${selectedCounty}, Kenya`
      : `${defaultCoords.hubTown}, ${selectedCounty}, Kenya`
  );

  // Recipient details if for another person / location
  const [isDifferentLocation, setIsDifferentLocation] = useState<boolean>(false);
  const [recipientContact, setRecipientContact] = useState<LocationRecipientContact>({
    recipientName: '',
    recipientPhone: '',
    recipientRelationship: 'Family / Relative',
    siteAccessInstructions: '',
  });

  const [isConfirmedByCustomer, setIsConfirmedByCustomer] = useState<boolean>(false);

  // Active location record
  const refreshLocationRecord = useCallback((
    coords: GeoCoordinate,
    source: LocationSource,
    permStatus: LocationPermissionStatus,
    addressOverride?: string,
    placeIdOverride?: string,
    confirmed?: boolean
  ) => {
    const record = GoogleMapsEngineService.createLocationRecord({
      lat: coords.lat,
      lng: coords.lng,
      county: selectedCounty,
      subCounty: selectedSubCounty,
      townOrArea,
      fullAddress: addressOverride || fullAddress,
      googlePlaceId: placeIdOverride,
      permissionStatus: permStatus,
      source,
      isDifferentInstallationLocation: isDifferentLocation,
      recipientContact: isDifferentLocation ? recipientContact : undefined,
      requiredSpecialty,
      confirmedByCustomer: confirmed !== undefined ? confirmed : isConfirmedByCustomer,
    });

    if (onLocationChange) {
      onLocationChange(record);
    }
    return record;
  }, [selectedCounty, selectedSubCounty, townOrArea, fullAddress, isDifferentLocation, recipientContact, requiredSpecialty, isConfirmedByCustomer, onLocationChange]);

  const handleCountyChange = (newCountyWithSuffix: string) => {
    setSelectedCounty(newCountyWithSuffix);
    const norm = GoogleMapsEngineService.normalizeCounty(newCountyWithSuffix);
    const coords = KENYA_COUNTY_COORDINATES[norm] || KENYA_COUNTY_COORDINATES['Nairobi'];
    const subs = GoogleMapsEngineService.getSubCounties(norm);
    setSelectedSubCounty(subs[0] || '');
    setTownOrArea('');
    setCurrentCoords({ lat: coords.lat, lng: coords.lng });
    const addr = `${coords.hubTown}, ${norm} County, Kenya`;
    setFullAddress(addr);
    setIsConfirmedByCustomer(false);
    refreshLocationRecord(coords, 'COUNTY_DEFAULT', 'MANUAL', addr);
  };

  const handleConfirmLocation = () => {
    setIsConfirmedByCustomer(true);
    const confirmedRecord = refreshLocationRecord(
      currentCoords,
      'MANUAL_MAP_PIN',
      'MANUAL',
      fullAddress,
      undefined,
      true
    );
    onLocationConfirmed(confirmedRecord);
  };

  const whatsappLocationUrl = `https://wa.me/${FEATURE_FLAGS.OFFICIAL_WHATSAPP_NUMBER}?text=${encodeURIComponent(
    FEATURE_FLAGS.WHATSAPP_LOCATION_MESSAGE
  )}`;

  // =========================================================================
  // PRODUCTION ACTIVE MODE: SAFE MANUAL SELECTION + WHATSAPP LOCATION OPTION
  // (Prevents Google Maps billing and avoids browser geolocation requests)
  // =========================================================================
  if (!isMapsEnabled) {
    return (
      <div className="bg-white rounded-3xl border border-[#EEECEC] shadow-sm p-5 sm:p-7 space-y-6">
        {/* Header with Customer-Facing Wording */}
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-8 h-8 rounded-xl bg-[#F0C9CB]/40 text-[#C01E25] flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-black text-[#1E1B1C]">{title}</h3>
          </div>
          <p className="text-xs sm:text-sm text-[#5C4D50] leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* WhatsApp Location Alternative Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#25D366]/10 via-white to-emerald-50/40 border border-[#25D366]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-extrabold text-[#128C7E]">
              <MessageCircle className="w-4 h-4 fill-[#25D366] text-[#25D366]" />
              <span>Share Location via WhatsApp</span>
            </div>
            <p className="text-[11px] sm:text-xs text-[#5C4D50] leading-snug">
              Prefer to send your live pin on WhatsApp? Tap the button below to message our team directly and share your location pin.
            </p>
          </div>

          <a
            href={whatsappLocationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-xs transition-all shadow-sm hover:shadow shrink-0 cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-current" />
            <span>Share Location on WhatsApp</span>
            <ExternalLink className="w-3 h-3 opacity-80" />
          </a>
        </div>

        {/* Manual Address & Regional Location Form */}
        <div className="space-y-4">
          <div className="text-xs font-black uppercase tracking-wider text-[#5C4D50] flex items-center gap-1.5">
            <span>Provide Location Details</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* County Selection */}
            <div>
              <label className="text-[11px] font-bold text-[#5C4D50] block mb-1">County (Required)</label>
              <select
                value={selectedCounty}
                onChange={(e) => handleCountyChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white text-xs font-semibold text-[#1E1B1C] border border-[#EEECEC] focus:outline-none focus:ring-2 focus:ring-[#C01E25] cursor-pointer"
              >
                {KENYAN_COUNTIES.map((c) => (
                  <option key={c.name} value={`${c.name} County`}>
                    {c.name} County
                  </option>
                ))}
              </select>
            </div>

            {/* Sub-County Selection */}
            <div>
              <label className="text-[11px] font-bold text-[#5C4D50] block mb-1">Sub-County / Constituency</label>
              <select
                value={selectedSubCounty}
                onChange={(e) => {
                  setSelectedSubCounty(e.target.value);
                  const addr = `${townOrArea ? townOrArea + ', ' : ''}${e.target.value}, ${selectedCounty}, Kenya`;
                  setFullAddress(addr);
                  refreshLocationRecord(currentCoords, 'MANUAL_MAP_PIN', 'MANUAL', addr);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white text-xs font-semibold text-[#1E1B1C] border border-[#EEECEC] focus:outline-none focus:ring-2 focus:ring-[#C01E25] cursor-pointer"
              >
                <option value="">Select Sub-County...</option>
                {subCounties.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Town, Estate, Landmark, Street */}
          <div>
            <label className="text-[11px] font-bold text-[#5C4D50] block mb-1">
              Town, Estate, Landmark or Physical Address
            </label>
            <input
              type="text"
              value={townOrArea}
              onChange={(e) => {
                const val = e.target.value;
                setTownOrArea(val);
                const addr = `${val ? val + ', ' : ''}${selectedSubCounty ? selectedSubCounty + ', ' : ''}${selectedCounty}, Kenya`;
                setFullAddress(addr);
                refreshLocationRecord(currentCoords, 'MANUAL_MAP_PIN', 'MANUAL', addr);
              }}
              placeholder="e.g. Kilimani, Karen, Syokimau near Gateway Mall, Nyali Links Road"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white text-xs font-semibold text-[#1E1B1C] border border-[#EEECEC] focus:outline-none focus:ring-2 focus:ring-[#C01E25]"
            />
          </div>

          {/* Recipient Toggle: If for another person */}
          {showRecipientToggle && (
            <div className="p-4 rounded-2xl bg-[#EEECEC]/40 border border-[#EEECEC] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-[#C01E25]" />
                  <span className="text-xs font-bold text-[#1E1B1C]">
                    Is this installation for another person or property?
                  </span>
                </div>

                <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#EEECEC]">
                  <button
                    type="button"
                    onClick={() => {
                      setIsDifferentLocation(false);
                      refreshLocationRecord(currentCoords, 'MANUAL_MAP_PIN', 'MANUAL');
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      !isDifferentLocation ? 'bg-[#C01E25] text-white' : 'text-[#5C4D50] hover:text-[#1E1B1C]'
                    }`}
                  >
                    No
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsDifferentLocation(true);
                      refreshLocationRecord(currentCoords, 'MANUAL_MAP_PIN', 'MANUAL');
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isDifferentLocation ? 'bg-[#C01E25] text-white' : 'text-[#5C4D50] hover:text-[#1E1B1C]'
                    }`}
                  >
                    Yes
                  </button>
                </div>
              </div>

              {isDifferentLocation && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#DDDADA]">
                  <div>
                    <label className="text-[11px] font-bold text-[#5C4D50] block mb-1">On-Site Contact Name</label>
                    <input
                      type="text"
                      value={recipientContact.recipientName}
                      onChange={(e) => {
                        const updated = { ...recipientContact, recipientName: e.target.value };
                        setRecipientContact(updated);
                        refreshLocationRecord(currentCoords, 'MANUAL_MAP_PIN', 'MANUAL');
                      }}
                      placeholder="e.g. Samuel Mutiso (Caretaker)"
                      className="w-full px-3 py-2 rounded-xl bg-white text-xs border border-[#EEECEC] focus:outline-none focus:ring-1 focus:ring-[#C01E25]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#5C4D50] block mb-1">On-Site Contact Phone</label>
                    <input
                      type="tel"
                      value={recipientContact.recipientPhone}
                      onChange={(e) => {
                        const updated = { ...recipientContact, recipientPhone: e.target.value };
                        setRecipientContact(updated);
                        refreshLocationRecord(currentCoords, 'MANUAL_MAP_PIN', 'MANUAL');
                      }}
                      placeholder="e.g. +254 712 345 678"
                      className="w-full px-3 py-2 rounded-xl bg-white text-xs border border-[#EEECEC] focus:outline-none focus:ring-1 focus:ring-[#C01E25]"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Location Summary and Confirmation */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#EEECEC]">
            <div className="text-xs text-[#5C4D50]">
              <span className="font-extrabold text-[#1E1B1C] block">Selected Address:</span>
              <span className="text-[11px]">{fullAddress}</span>
            </div>

            <button
              type="button"
              onClick={handleConfirmLocation}
              className={`px-5 py-2.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                isConfirmedByCustomer
                  ? 'bg-emerald-700 text-white shadow-emerald-700/20'
                  : 'bg-[#C01E25] hover:bg-[#a1181e] text-white shadow-[#C01E25]/25'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isConfirmedByCustomer ? 'Location Confirmed' : 'Confirm Location'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RESTORATION MODE: GOOGLE MAPS INTERACTIVE PICKER (Activated via Flag)
  // =========================================================================
  const apiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyAAwaPM3xLQrgvFDga5BSEq3lCd1HftD7s';
  const [mapZoom, setMapZoom] = useState<number>(13);
  const [mapTypeId, setMapTypeId] = useState<'roadmap' | 'hybrid'>('roadmap');

  return (
    <div className="bg-white rounded-3xl border border-[#EEECEC] shadow-sm p-5 sm:p-7 space-y-5">
      <div>
        <h3 className="text-base font-black text-[#1E1B1C]">{title}</h3>
        <p className="text-xs text-[#5C4D50] mt-1">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-[11px] font-bold text-[#5C4D50] block mb-1">County</label>
          <select
            value={selectedCounty}
            onChange={(e) => handleCountyChange(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-white text-xs border border-[#EEECEC]"
          >
            {KENYAN_COUNTIES.map((c) => (
              <option key={c.name} value={`${c.name} County`}>
                {c.name} County
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[11px] font-bold text-[#5C4D50] block mb-1">Town / Landmark</label>
          <input
            type="text"
            value={townOrArea}
            onChange={(e) => setTownOrArea(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-white text-xs border border-[#EEECEC]"
          />
        </div>
      </div>

      <div className="h-[300px] rounded-2xl overflow-hidden border border-[#EEECEC]">
        <APIProvider apiKey={apiKey}>
          <Map
            defaultCenter={currentCoords}
            center={currentCoords}
            defaultZoom={mapZoom}
            zoom={mapZoom}
            mapTypeId={mapTypeId}
            style={{ width: '100%', height: '100%' }}
          >
            <MapCenterController coords={currentCoords} zoom={mapZoom} />
            <AdvancedMarker position={currentCoords} />
          </Map>
        </APIProvider>
      </div>
    </div>
  );
};
