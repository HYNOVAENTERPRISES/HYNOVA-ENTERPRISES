/// <reference types="@types/google.maps" />
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  MapControl,
  ControlPosition,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import {
  MapPin,
  Navigation,
  Search,
  Crosshair,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Car,
  Layers,
  Sparkles,
  Building,
  User,
  Phone,
  Maximize2
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
  KENYA_SUB_COUNTIES, 
  GeoCoordinate,
  TravelZone
} from '../services/googleMapsEngine';
import { KENYAN_COUNTIES } from '../data/mockData';
import { InteractiveKenyaTileMap } from './InteractiveKenyaTileMap';

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

// Controller component to smoothly center and re-pan the Google Map
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

// Search Box with both Google Places Autocomplete (if enabled) and Instant Kenyan Landmark/Coordinate Search
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
      // Caught in case of Places API billing error
    }
  }, [placesLib, onPlaceSelected, isBillingError]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onManualSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full flex items-center gap-2">
      <div className="relative flex-grow">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5C4D50]">
          <Search className="w-4 h-4" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search landmark (e.g. Karen, Westlands, Naivasha, Nyali), address, or coords in ${countyHint}...`}
          className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white text-[#1E1B1C] rounded-xl border border-[#EEECEC] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#C01E25] focus:border-transparent transition-all placeholder:text-[#5C4D50]/60"
        />
      </div>
      <button
        type="submit"
        className="px-4 py-2.5 rounded-xl bg-[#C01E25] hover:bg-[#a1181e] text-white text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer flex items-center gap-1.5"
      >
        <Search className="w-3.5 h-3.5" />
        <span>Find</span>
      </button>
    </form>
  );
};

export const GoogleMapsLocationPicker: React.FC<GoogleMapsLocationPickerProps> = ({
  initialCounty = 'Nairobi',
  initialSubCounty = '',
  initialTown = '',
  requiredSpecialty,
  onLocationConfirmed,
  onLocationChange,
  title = 'Pin Exact Installation Location',
  subtitle = 'High-precision Google Maps location for accurate logistics, site surveys, and technician dispatch.',
  showRecipientToggle = true,
}) => {
  const apiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyAAwaPM3xLQrgvFDga5BSEq3lCd1HftD7s';

  // Step 1: Service Area Selection State
  const [selectedCounty, setSelectedCounty] = useState<string>(() => {
    const norm = GoogleMapsEngineService.normalizeCounty(initialCounty);
    return `${norm} County`;
  });
  const [selectedSubCounty, setSelectedSubCounty] = useState<string>(initialSubCounty);
  const [townOrArea, setTownOrArea] = useState<string>(initialTown);

  // Available Sub-Counties for current county
  const subCounties = GoogleMapsEngineService.getSubCounties(selectedCounty);

  // Step 2: Google Maps Pinning State
  const normalizedCounty = GoogleMapsEngineService.normalizeCounty(selectedCounty);
  const defaultCoords = KENYA_COUNTY_COORDINATES[normalizedCounty] || KENYA_COUNTY_COORDINATES['Nairobi'];
  const [currentCoords, setCurrentCoords] = useState<GeoCoordinate>({
    lat: defaultCoords.lat,
    lng: defaultCoords.lng,
  });
  const [mapZoom, setMapZoom] = useState<number>(14);
  const [mapTypeId, setMapTypeId] = useState<'roadmap' | 'hybrid'>('roadmap');

  // Privacy-First Location Permission Modal State
  const [showPermissionDialog, setShowPermissionDialog] = useState<boolean>(false);
  const [permissionStatus, setPermissionStatus] = useState<LocationPermissionStatus>('MANUAL');
  const [locationSource, setLocationSource] = useState<LocationSource>('COUNTY_DEFAULT');
  const [isLocatingGPS, setIsLocatingGPS] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Google Maps Cloud Billing & Auth State
  const [isBillingError, setIsBillingError] = useState<boolean>(false);
  const [useTileMap, setUseTileMap] = useState<boolean>(false);

  // Catch unhandled Google Maps billing and auth failures gracefully
  useEffect(() => {
    const handleAuthFailure = () => {
      setIsBillingError(true);
      setUseTileMap(true);
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
        setUseTileMap(true);
      }
    };

    (window as any).gm_authFailure = handleAuthFailure;
    window.addEventListener('error', handleWindowError);

    const originalConsoleError = console.error;
    console.error = (...args: any[]) => {
      try {
        const fullText = args
          .map((a) => (typeof a === 'object' && a !== null ? (a.message || JSON.stringify(a)) : String(a)))
          .join(' ');
        if (
          fullText.includes('BillingNotEnabledMapError') ||
          fullText.includes('billing/enable') ||
          fullText.includes('Places API error')
        ) {
          setIsBillingError(true);
          setUseTileMap(true);
        }
      } catch {
        // Safe console guard
      }
      originalConsoleError.apply(console, args);
    };

    return () => {
      window.removeEventListener('error', handleWindowError);
      console.error = originalConsoleError;
    };
  }, []);

  // Geocoded details
  const [fullAddress, setFullAddress] = useState<string>(`${defaultCoords.hubTown}, ${selectedCounty}, Kenya`);
  const [googlePlaceId, setGooglePlaceId] = useState<string | undefined>(undefined);

  // Recipient Support: Is this installation for another location?
  const [isDifferentLocation, setIsDifferentLocation] = useState<boolean>(false);
  const [recipientContact, setRecipientContact] = useState<LocationRecipientContact>({
    recipientName: '',
    recipientPhone: '',
    recipientRelationship: 'Family / Relative',
    siteAccessInstructions: '',
  });

  // Customer Confirmation Checkbox
  const [isConfirmedByCustomer, setIsConfirmedByCustomer] = useState<boolean>(false);

  // Operational Calculations Result
  const [currentRecord, setCurrentRecord] = useState<HynovaLocationRecord>(() =>
    GoogleMapsEngineService.createLocationRecord({
      lat: defaultCoords.lat,
      lng: defaultCoords.lng,
      county: selectedCounty,
      subCounty: selectedSubCounty,
      townOrArea,
      fullAddress: `${defaultCoords.hubTown}, ${selectedCounty}, Kenya`,
      permissionStatus: 'MANUAL',
      source: 'COUNTY_DEFAULT',
      requiredSpecialty,
      confirmedByCustomer: false,
    })
  );

  // Recalculate operational record whenever coordinates or settings change
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
      googlePlaceId: placeIdOverride || googlePlaceId,
      permissionStatus: permStatus,
      source,
      isDifferentInstallationLocation: isDifferentLocation,
      recipientContact: isDifferentLocation ? recipientContact : undefined,
      requiredSpecialty,
      confirmedByCustomer: confirmed !== undefined ? confirmed : isConfirmedByCustomer,
    });

    setCurrentRecord(record);
    if (onLocationChange) {
      onLocationChange(record);
    }
  }, [selectedCounty, selectedSubCounty, townOrArea, fullAddress, googlePlaceId, isDifferentLocation, recipientContact, requiredSpecialty, isConfirmedByCustomer, onLocationChange]);

  // When county changes in Step 1, update center coordinates
  const handleCountyChange = (newCountyWithSuffix: string) => {
    setSelectedCounty(newCountyWithSuffix);
    const norm = GoogleMapsEngineService.normalizeCounty(newCountyWithSuffix);
    const coords = KENYA_COUNTY_COORDINATES[norm] || KENYA_COUNTY_COORDINATES['Nairobi'];
    const subs = GoogleMapsEngineService.getSubCounties(norm);
    setSelectedSubCounty(subs[0] || '');
    setTownOrArea('');
    setCurrentCoords({ lat: coords.lat, lng: coords.lng });
    setMapZoom(13);
    const addr = `${coords.hubTown}, ${norm} County, Kenya`;
    setFullAddress(addr);
    setLocationSource('COUNTY_DEFAULT');
    setIsConfirmedByCustomer(false);
    refreshLocationRecord(coords, 'COUNTY_DEFAULT', permissionStatus, addr);
  };

  // Handle GPS location request with Privacy-First Permission
  const handleRequestGPS = () => {
    setShowPermissionDialog(true);
  };

  const handleGrantLocationAccess = () => {
    setShowPermissionDialog(false);
    setIsLocatingGPS(true);
    setGpsError(null);

    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser. Please search or drop a pin manually.');
      setIsLocatingGPS(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: GeoCoordinate = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setCurrentCoords(coords);
        setMapZoom(17);
        setPermissionStatus('GRANTED');
        setLocationSource('GPS_CURRENT_LOCATION');
        setIsLocatingGPS(false);

        const gpsAddr = `GPS Pin (${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}) • ${selectedCounty}`;
        setFullAddress(gpsAddr);
        refreshLocationRecord(coords, 'GPS_CURRENT_LOCATION', 'GRANTED', gpsAddr);
      },
      (err) => {
        setIsLocatingGPS(false);
        setPermissionStatus('DENIED');
        console.warn('Geolocation permission declined or unavailable:', err.message);
        setGpsError('Could not retrieve current location. You can search or drop a pin manually on the map.');
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  };

  const handleDeclineLocationAccess = () => {
    setShowPermissionDialog(false);
    setPermissionStatus('MANUAL');
  };

  // Map Click or Marker Drag handler
  const handleMapClick = (e: any) => {
    if (e.detail?.latLng) {
      const lat = e.detail.latLng.lat;
      const lng = e.detail.latLng.lng;
      const newCoords = { lat, lng };
      setCurrentCoords(newCoords);
      setLocationSource('MANUAL_MAP_PIN');
      setPermissionStatus('MANUAL');
      const pinAddr = `Pinned Rooftop (${lat.toFixed(5)}, ${lng.toFixed(5)}) • ${townOrArea || selectedSubCounty || selectedCounty}`;
      setFullAddress(pinAddr);
      setIsConfirmedByCustomer(false);
      refreshLocationRecord(newCoords, 'MANUAL_MAP_PIN', 'MANUAL', pinAddr);
    }
  };

  const handleMarkerDragEnd = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      const newCoords = { lat, lng };
      setCurrentCoords(newCoords);
      setLocationSource('MANUAL_MAP_PIN');
      const pinAddr = `Custom Pinned Position (${lat.toFixed(5)}, ${lng.toFixed(5)}) • ${townOrArea || selectedSubCounty || selectedCounty}`;
      setFullAddress(pinAddr);
      setIsConfirmedByCustomer(false);
      refreshLocationRecord(newCoords, 'MANUAL_MAP_PIN', permissionStatus, pinAddr);
    }
  };

  // Place search selection handler
  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    if (place.geometry && place.geometry.location) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const newCoords = { lat, lng };
      setCurrentCoords(newCoords);
      setMapZoom(16);
      setLocationSource('SEARCH_AUTOCOMPLETE');
      setGooglePlaceId(place.place_id);
      const addr = place.formatted_address || place.name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
      setFullAddress(addr);

      // Attempt to extract town / subcounty from place components if available
      if (place.address_components) {
        for (const comp of place.address_components) {
          if (comp.types.includes('sublocality') || comp.types.includes('neighborhood')) {
            setTownOrArea(comp.long_name);
          }
        }
      }

      setIsConfirmedByCustomer(false);
      refreshLocationRecord(newCoords, 'SEARCH_AUTOCOMPLETE', permissionStatus, addr, place.place_id);
    }
  };

  // Instant Kenyan Landmark, Estate, Town, or Coordinate search
  const handleManualSearch = (searchQuery: string) => {
    const match = GoogleMapsEngineService.searchKenyanLocations(searchQuery);
    if (match) {
      setCurrentCoords(match.coords);
      setMapZoom(16);
      setLocationSource('SEARCH_AUTOCOMPLETE');
      setFullAddress(match.fullAddress);
      if (match.county) {
        setSelectedCounty(match.county);
      }
      if (match.subCounty) {
        setSelectedSubCounty(match.subCounty);
      }
      setIsConfirmedByCustomer(false);
      refreshLocationRecord(match.coords, 'SEARCH_AUTOCOMPLETE', permissionStatus, match.fullAddress);
    } else {
      const pinAddr = `${searchQuery.trim()}, ${selectedCounty}, Kenya`;
      setFullAddress(pinAddr);
      setLocationSource('SEARCH_AUTOCOMPLETE');
      setIsConfirmedByCustomer(false);
      refreshLocationRecord(currentCoords, 'SEARCH_AUTOCOMPLETE', permissionStatus, pinAddr);
    }
  };

  // Handle final confirmation
  const handleConfirmLocation = () => {
    if (!isConfirmedByCustomer) {
      alert('Please check the confirmation box to verify this is the correct installation location.');
      return;
    }
    const finalRecord = { ...currentRecord, confirmedByCustomer: true, confirmedAt: new Date().toISOString() };
    GoogleMapsEngineService.saveLocationRecord(finalRecord);
    onLocationConfirmed(finalRecord);
  };

  return (
    <div className="bg-white rounded-3xl border border-[#EEECEC] p-5 sm:p-7 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EEECEC]">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#C01E25] bg-[#F0C9CB]/40 px-3 py-1 rounded-full mb-1.5">
            <MapPin className="w-3.5 h-3.5" />
            <span>Precise Installation Location Engine</span>
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-[#1E1B1C] tracking-tight">
            {title}
          </h3>
          <p className="text-xs text-[#5C4D50] mt-0.5 max-w-2xl">
            {subtitle}
          </p>
        </div>

        {/* Location Confidence Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 ${
            currentRecord.confidenceScore >= 95
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : currentRecord.confidenceScore >= 80
              ? 'bg-blue-50 text-blue-800 border-blue-200'
              : 'bg-amber-50 text-amber-800 border-amber-200'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              currentRecord.confidenceScore >= 95 ? 'bg-emerald-500' : currentRecord.confidenceScore >= 80 ? 'bg-blue-500' : 'bg-amber-500'
            }`} />
            <span>Confidence: {currentRecord.confidenceScore}%</span>
          </div>
        </div>
      </div>

      {/* STEP 1: GENERAL SERVICE AREA (County, Sub-County, Town/Area) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-[#5C4D50] flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-[#1E1B1C] text-white flex items-center justify-center text-[10px]">1</span>
            <span>Select Regional Service Area</span>
          </span>
          <span className="text-[11px] text-[#5C4D50]">Provides general regional dispatch zone</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* County Selector */}
          <div>
            <label className="text-[11px] font-bold text-[#5C4D50] block mb-1">County (Required)</label>
            <select
              value={selectedCounty}
              onChange={(e) => handleCountyChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white text-xs sm:text-sm font-semibold text-[#1E1B1C] border border-[#EEECEC] focus:outline-none focus:ring-2 focus:ring-[#C01E25] cursor-pointer"
            >
              {KENYAN_COUNTIES.map((c) => (
                <option key={c.name} value={`${c.name} County`}>
                  {c.name} County ({c.activeTechs} Techs)
                </option>
              ))}
            </select>
          </div>

          {/* Sub-County Selector */}
          <div>
            <label className="text-[11px] font-bold text-[#5C4D50] block mb-1">Sub-County / Constituency</label>
            <select
              value={selectedSubCounty}
              onChange={(e) => {
                setSelectedSubCounty(e.target.value);
                refreshLocationRecord(currentCoords, locationSource, permissionStatus);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white text-xs sm:text-sm font-semibold text-[#1E1B1C] border border-[#EEECEC] focus:outline-none focus:ring-2 focus:ring-[#C01E25] cursor-pointer"
            >
              <option value="">Select Sub-County...</option>
              {subCounties.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>

          {/* Town / Estate / Neighborhood */}
          <div>
            <label className="text-[11px] font-bold text-[#5C4D50] block mb-1">Town / Estate / Neighborhood</label>
            <input
              type="text"
              value={townOrArea}
              onChange={(e) => {
                setTownOrArea(e.target.value);
                refreshLocationRecord(currentCoords, locationSource, permissionStatus);
              }}
              placeholder="e.g. Kilimani, Karen, Syokimau, Nyali"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white text-xs sm:text-sm font-semibold text-[#1E1B1C] border border-[#EEECEC] focus:outline-none focus:ring-2 focus:ring-[#C01E25]"
            />
          </div>
        </div>
      </div>

      {/* STEP 2: INTERACTIVE GOOGLE MAP PINNING */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-[#5C4D50] flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-[#C01E25] text-white flex items-center justify-center text-[10px]">2</span>
            <span>Pin Exact Installation Location on Google Map</span>
          </span>

          {/* Map Actions: GPS vs Manual */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRequestGPS}
              disabled={isLocatingGPS}
              className="px-3 py-1.5 rounded-xl bg-[#EEECEC] hover:bg-[#DDDADA] text-[#1E1B1C] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Crosshair className={`w-3.5 h-3.5 text-[#C01E25] ${isLocatingGPS ? 'animate-spin' : ''}`} />
              <span>{isLocatingGPS ? 'Detecting GPS...' : 'Use My Current Location'}</span>
            </button>

            <button
              type="button"
              onClick={() => setMapTypeId(mapTypeId === 'roadmap' ? 'hybrid' : 'roadmap')}
              className="px-3 py-1.5 rounded-xl bg-[#EEECEC] hover:bg-[#DDDADA] text-[#1E1B1C] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-[#5C4D50]" />
              <span>{mapTypeId === 'roadmap' ? 'Satellite View' : 'Map View'}</span>
            </button>
          </div>
        </div>

        {/* GPS Error Alert */}
        {gpsError && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{gpsError}</span>
          </div>
        )}

        {/* Google Cloud Project Billing Notice (shown if BillingNotEnabledMapError occurs) */}
        {isBillingError && (
          <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-300 text-amber-900 text-xs space-y-2 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div className="flex items-center gap-2 font-black text-amber-950">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Google Cloud Project Notice: Billing Activation Required</span>
              </div>
              <span className="text-[10px] font-mono bg-amber-200/80 px-2 py-0.5 rounded text-amber-950 font-bold self-start sm:self-auto">
                BillingNotEnabledMapError
              </span>
            </div>
            <p className="leading-relaxed text-[11px] text-amber-900">
              The Google Maps Platform API key requires billing to be enabled in your Google Cloud Console. To use Google-hosted Places Autocomplete and live Google tiles, enable billing at{' '}
              <a
                href="https://console.cloud.google.com/project/_/billing/enable"
                target="_blank"
                rel="noopener noreferrer"
                className="font-extrabold text-[#C01E25] underline hover:text-[#a1181e]"
              >
                console.cloud.google.com/project/_/billing/enable
              </a>.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-800 font-bold bg-white/70 p-2.5 rounded-xl border border-amber-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>HYNOVA High-Precision Interactive Map & Pricing Engine are operating in fallback mode below.</span>
            </div>
          </div>
        )}

        {/* Search Bar on top of map */}
        <div className="w-full">
          <PlaceSearchBox 
            onPlaceSelected={handlePlaceSelect} 
            onManualSearch={handleManualSearch} 
            countyHint={normalizedCounty} 
            isBillingError={isBillingError}
          />
        </div>

        {/* Map Container: InteractiveKenyaTileMap fallback or Google Maps */}
        {useTileMap || isBillingError ? (
          <InteractiveKenyaTileMap
            coords={currentCoords}
            zoom={mapZoom}
            mapTypeId={mapTypeId}
            onCoordsChange={(newCoords) => {
              setCurrentCoords(newCoords);
              setLocationSource('MANUAL_MAP_PIN');
              const pinAddr = `Pinned Rooftop (${newCoords.lat.toFixed(5)}, ${newCoords.lng.toFixed(5)}) • ${townOrArea || selectedSubCounty || selectedCounty}`;
              setFullAddress(pinAddr);
              setIsConfirmedByCustomer(false);
              refreshLocationRecord(newCoords, 'MANUAL_MAP_PIN', permissionStatus, pinAddr);
            }}
          />
        ) : (
          <div className="relative w-full h-[360px] sm:h-[420px] rounded-2xl overflow-hidden border border-[#EEECEC] shadow-inner">
            <APIProvider 
              apiKey={apiKey}
              onError={() => {
                setIsBillingError(true);
                setUseTileMap(true);
              }}
            >
              <Map
                mapId="DEMO_MAP_ID"
                internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                defaultCenter={currentCoords}
                center={currentCoords}
                defaultZoom={mapZoom}
                zoom={mapZoom}
                mapTypeId={mapTypeId}
                gestureHandling="greedy"
                disableDefaultUI={false}
                zoomControl={true}
                onClick={handleMapClick}
                style={{ width: '100%', height: '100%' }}
              >
                <MapCenterController coords={currentCoords} zoom={mapZoom} />

                {/* Pin Installation Location AdvancedMarker */}
                <AdvancedMarker
                  position={currentCoords}
                  draggable={true}
                  onDragEnd={handleMarkerDragEnd}
                  title="HYNOVA Installation Site"
                >
                  <div className="flex flex-col items-center group cursor-grab active:cursor-grabbing">
                    <div className="bg-[#C01E25] text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-md mb-1 whitespace-nowrap border border-white">
                      Drop Pin Here
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#C01E25] text-white border-2 border-white shadow-xl flex items-center justify-center animate-bounce">
                      <MapPin className="w-5 h-5 fill-current" />
                    </div>
                    <div className="w-2.5 h-1 rounded-full bg-black/40 blur-[1px] mt-0.5" />
                  </div>
                </AdvancedMarker>
              </Map>
            </APIProvider>

            {/* Interactive Instructions floating pill */}
            <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-sm pointer-events-none">
              <div className="bg-white/95 backdrop-blur-md p-2.5 rounded-xl border border-[#EEECEC] shadow-md text-[11px] text-[#1E1B1C] flex items-center gap-2 pointer-events-auto">
                <Sparkles className="w-4 h-4 text-[#C01E25] shrink-0" />
                <span>Click anywhere on the map or drag the red pin to place your exact rooftop or gate.</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RECIPIENT TOGGLE: Is this installation for another location? */}
      {showRecipientToggle && (
        <div className="p-4 rounded-2xl bg-[#EEECEC]/50 border border-[#EEECEC] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-[#C01E25]" />
              <span className="text-xs font-bold text-[#1E1B1C]">
                Is this installation for another location or recipient?
              </span>
            </div>

            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#EEECEC]">
              <button
                type="button"
                onClick={() => {
                  setIsDifferentLocation(false);
                  refreshLocationRecord(currentCoords, locationSource, permissionStatus);
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
                  refreshLocationRecord(currentCoords, locationSource, permissionStatus);
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
            <div className="pt-2 border-t border-[#DDDADA] grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in">
              <div className="sm:col-span-2 text-[11px] text-[#C01E25] font-semibold bg-[#F0C9CB]/30 p-2 rounded-lg">
                Operational Notice: The pinned installation location will be used for all technician deployment, site survey, and travel calculations. Billing address will not be used for technician dispatch.
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#5C4D50] block mb-1">On-Site Recipient / Contact Name</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 absolute left-3 top-3 text-[#5C4D50]" />
                  <input
                    type="text"
                    value={recipientContact.recipientName}
                    onChange={(e) => setRecipientContact({ ...recipientContact, recipientName: e.target.value })}
                    placeholder="e.g. Jane Wangari (Property Caretaker)"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white rounded-xl border border-[#EEECEC] focus:ring-1 focus:ring-[#C01E25]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#5C4D50] block mb-1">On-Site Contact Phone (Kenya)</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 absolute left-3 top-3 text-[#5C4D50]" />
                  <input
                    type="tel"
                    value={recipientContact.recipientPhone}
                    onChange={(e) => setRecipientContact({ ...recipientContact, recipientPhone: e.target.value })}
                    placeholder="07XX XXX XXX"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white rounded-xl border border-[#EEECEC] focus:ring-1 focus:ring-[#C01E25]"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] font-bold text-[#5C4D50] block mb-1">Access Instructions (Gate Code, Landmark, Parking)</label>
                <input
                  type="text"
                  value={recipientContact.siteAccessInstructions}
                  onChange={(e) => setRecipientContact({ ...recipientContact, siteAccessInstructions: e.target.value })}
                  placeholder="e.g. Opposite Total Energies, black gate with solar light"
                  className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-[#EEECEC] focus:ring-1 focus:ring-[#C01E25]"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* OPERATIONAL DISTANCE & PRICING ENGINE TELEMETRY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 rounded-2xl bg-gradient-to-br from-[#EEECEC]/60 to-[#EEECEC]/20 border border-[#EEECEC]">
        
        {/* Nearest Service Hub */}
        <div className="p-3 bg-white rounded-xl border border-[#EEECEC] space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#5C4D50] block">Nearest HYNOVA Hub</span>
          <div className="text-xs font-extrabold text-[#1E1B1C] truncate">{currentRecord.nearestZoneName}</div>
          <div className="text-[11px] font-bold text-[#C01E25] flex items-center gap-1">
            <Car className="w-3 h-3" />
            <span>{currentRecord.distanceFromZoneKm} km away</span>
          </div>
        </div>

        {/* Matched Technician Proximity */}
        <div className="p-3 bg-white rounded-xl border border-[#EEECEC] space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#5C4D50] block">Assigned Technician Proximity</span>
          <div className="text-xs font-extrabold text-[#1E1B1C] truncate">{currentRecord.nearestTechnicianName}</div>
          <div className="text-[11px] text-[#128C7E] font-bold flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{currentRecord.distanceFromTechnicianKm} km (~{currentRecord.estimatedTravelTimeMinutes} mins)</span>
          </div>
        </div>

        {/* Travel Zone & Surcharge */}
        <div className="p-3 bg-white rounded-xl border border-[#EEECEC] space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#5C4D50] block">Deployment Zone & Travel</span>
          <div className="text-xs font-extrabold text-[#1E1B1C]">{currentRecord.serviceZoneTier}</div>
          <div className="text-[11px] font-bold text-[#5C4D50]">
            {currentRecord.travelChargesKES === 0 ? (
              <span className="text-emerald-600 font-extrabold">Zone A: Free Travel</span>
            ) : (
              <span>Surcharge: KES {currentRecord.travelChargesKES.toLocaleString()}</span>
            )}
          </div>
        </div>

        {/* Site Survey Fee & Recommendation */}
        <div className="p-3 bg-white rounded-xl border border-[#EEECEC] space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#5C4D50] block">Site Survey Status</span>
          <div className="text-xs font-extrabold text-[#1E1B1C]">
            KES {currentRecord.siteSurveyFeeKES.toLocaleString()}
          </div>
          <div className="text-[10px] font-bold text-[#C01E25] truncate" title={currentRecord.surveyReason}>
            {currentRecord.surveyRecommendation === 'WAIVED_ELIGIBLE' 
              ? '✓ Waived for online order' 
              : currentRecord.surveyRecommendation === 'OPTIONAL' 
              ? 'Optional Quick Survey' 
              : 'Physical Survey Recommended'}
          </div>
        </div>
      </div>

      {/* FINAL CUSTOMER CONFIRMATION CARD */}
      <div className="p-4 rounded-2xl bg-white border-2 border-[#C01E25]/30 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#C01E25]" />
            <span className="text-xs font-extrabold uppercase tracking-wide text-[#1E1B1C]">
              Installation Location Confirmation
            </span>
          </div>
          <span className="text-[11px] font-mono text-[#5C4D50]">
            {currentCoords.lat.toFixed(5)}, {currentCoords.lng.toFixed(5)}
          </span>
        </div>

        <div className="bg-[#EEECEC]/40 p-3 rounded-xl border border-[#EEECEC] text-xs font-semibold text-[#1E1B1C] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <MapPin className="w-4 h-4 text-[#C01E25] shrink-0" />
            <span className="truncate">{fullAddress}</span>
          </div>
          <span className="text-[11px] font-bold text-[#5C4D50] shrink-0">
            {currentRecord.confidenceLabel}
          </span>
        </div>

        {/* Mandatory Customer Checkbox */}
        <label className="flex items-start gap-2.5 cursor-pointer pt-1">
          <input
            type="checkbox"
            checked={isConfirmedByCustomer}
            onChange={(e) => {
              setIsConfirmedByCustomer(e.target.checked);
              refreshLocationRecord(currentCoords, locationSource, permissionStatus, undefined, undefined, e.target.checked);
            }}
            className="mt-0.5 w-4 h-4 rounded text-[#C01E25] focus:ring-[#C01E25] border-[#DDDADA]"
          />
          <span className="text-xs text-[#1E1B1C] font-bold">
            I confirm this is the correct installation location for logistics, deployment, and certified technician dispatch.
          </span>
        </label>

        {/* Submit / Confirm Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={handleConfirmLocation}
            className={`px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-md ${
              isConfirmedByCustomer
                ? 'bg-[#C01E25] hover:bg-[#a1181e] text-white shadow-[#C01E25]/25'
                : 'bg-[#EEECEC] text-[#5C4D50] cursor-not-allowed'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Lock & Confirm Installation Location</span>
          </button>
        </div>
      </div>

      {/* PRIVACY-FIRST LOCATION PERMISSION MODAL */}
      {showPermissionDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-[#EEECEC]">
            <div className="w-12 h-12 rounded-2xl bg-[#F0C9CB]/40 text-[#C01E25] flex items-center justify-center mb-2">
              <Crosshair className="w-6 h-6" />
            </div>

            <div>
              <h4 className="text-lg font-black text-[#1E1B1C]">
                Allow HYNOVA to Access Your Location?
              </h4>
              <p className="text-xs text-[#5C4D50] leading-relaxed mt-1">
                To help us calculate accurate installation, travel and service costs, HYNOVA can use your current location. You may also manually pin the installation location on the map.
              </p>
            </div>

            <div className="p-3 bg-[#EEECEC]/50 rounded-xl text-[11px] text-[#5C4D50] space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#1E1B1C]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C01E25]" />
                <span>Privacy & Security Guarantee</span>
              </div>
              <p>Your location coordinates are strictly encrypted and used solely for operational technician dispatch and distance pricing.</p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleDeclineLocationAccess}
                className="px-4 py-2.5 rounded-xl border border-[#EEECEC] text-xs font-bold text-[#5C4D50] hover:text-[#1E1B1C] hover:bg-[#EEECEC]/60 transition-colors cursor-pointer"
              >
                Enter Location Manually
              </button>

              <button
                type="button"
                onClick={handleGrantLocationAccess}
                className="px-5 py-2.5 rounded-xl bg-[#C01E25] hover:bg-[#a1181e] text-white text-xs font-extrabold shadow-md shadow-[#C01E25]/25 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Crosshair className="w-4 h-4" />
                <span>Allow Location Access</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
