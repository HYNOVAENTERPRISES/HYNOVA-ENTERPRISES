/**
 * HYNOVA Google Maps & Geolocation Logistics Engine
 * 
 * Operating Agreement Section 4 & 15 Compliance:
 * - Coverage: All 47 Kenyan Counties (No county excluded)
 * - Automatic Calculation: Customer location, Technician location, Supplier location,
 *   Travel distance, Travel duration, Deployment complexity, Coverage eligibility, County assignment.
 * - Technician Matching Logic:
 *   Priority 1: Nearest certified technician
 *   Priority 2: Highest rated technician
 *   Priority 3: Availability
 *   Priority 4: Required specialization
 * - Travel Zones:
 *   Zone A (0–15 KM): KES 1,000 Site Survey Fee, No travel surcharge
 *   Zone B (15–40 KM): KES 2,000 Site Survey Fee, Travel surcharge applies
 *   Zone C (40–100 KM): KES 3,500 Site Survey Fee, Extended deployment pricing
 *   Zone D (100+ KM): Custom Assessment Fee, Custom logistics assessment
 */

import { 
  TechnicianRank, 
  HynovaLocationRecord, 
  LocationPermissionStatus, 
  LocationSource, 
  LocationRecipientContact 
} from '../types';

export interface GeoCoordinate {
  lat: number;
  lng: number;
}

export type TravelZone = 'Zone A (0–15 KM)' | 'Zone B (15–40 KM)' | 'Zone C (40–100 KM)' | 'Zone D (100+ KM)';

export interface ServiceZoneHub {
  id: string;
  name: string;
  region: string;
  coordinates: GeoCoordinate;
  hubCity: string;
  coverageCounties: string[];
}

export const HYNOVA_REGIONAL_HUBS: ServiceZoneHub[] = [
  {
    id: 'hub-nbo',
    name: 'Nairobi Central & Metro Hub',
    region: 'Nairobi / Central Metro',
    coordinates: { lat: -1.286389, lng: 36.817223 },
    hubCity: 'Nairobi',
    coverageCounties: ['Nairobi', 'Kiambu', 'Machakos', 'Kajiado', 'Murang\'a'],
  },
  {
    id: 'hub-mba',
    name: 'Coast Regional Hub',
    region: 'Coast',
    coordinates: { lat: -4.043477, lng: 39.668206 },
    hubCity: 'Mombasa',
    coverageCounties: ['Mombasa', 'Kilifi', 'Kwale', 'Taita Taveta', 'Lamu', 'Tana River'],
  },
  {
    id: 'hub-nkr',
    name: 'Central Rift Regional Hub',
    region: 'Rift Valley',
    coordinates: { lat: -0.303099, lng: 36.080026 },
    hubCity: 'Nakuru',
    coverageCounties: ['Nakuru', 'Nyandarua', 'Baringo', 'Narok', 'Bomet', 'Kericho'],
  },
  {
    id: 'hub-ksm',
    name: 'Western & Lake Basin Hub',
    region: 'Lake Basin / Western',
    coordinates: { lat: -0.091702, lng: 34.767956 },
    hubCity: 'Kisumu',
    coverageCounties: ['Kisumu', 'Kakamega', 'Bungoma', 'Busia', 'Vihiga', 'Siaya', 'Homa Bay', 'Migori', 'Kisii', 'Nyamira'],
  },
  {
    id: 'hub-eld',
    name: 'North Rift Regional Hub',
    region: 'North Rift',
    coordinates: { lat: 0.514277, lng: 35.26978 },
    hubCity: 'Eldoret',
    coverageCounties: ['Uasin Gishu', 'Trans Nzoia', 'Nandi', 'Elgeyo Marakwet', 'West Pokot', 'Turkana'],
  },
  {
    id: 'hub-nyi',
    name: 'Mount Kenya Regional Hub',
    region: 'Mount Kenya',
    coordinates: { lat: -0.42013, lng: 36.94759 },
    hubCity: 'Nyeri',
    coverageCounties: ['Nyeri', 'Meru', 'Embu', 'Kirinyaga', 'Laikipia', 'Tharaka-Nithi', 'Isiolo', 'Marsabit', 'Kitui', 'Makueni', 'Garissa', 'Wajir', 'Mandera', 'Samburu'],
  },
];

export const KENYA_SUB_COUNTIES: Record<string, string[]> = {
  'Nairobi': ['Westlands', 'Dagoretti North', 'Dagoretti South', 'Lang\'ata', 'Kibra', 'Roysambu', 'Kasarani', 'Ruaraka', 'Embakasi South', 'Embakasi North', 'Embakasi Central', 'Embakasi East', 'Embakasi West', 'Makadara', 'Kamukunji', 'Starehe', 'Mathare', 'Kilimani', 'Karen', 'Lavington', 'Parklands'],
  'Kiambu': ['Thika Town', 'Ruiru', 'Juja', 'Kiambu Town', 'Kikuyu', 'Limuru', 'Kabete', 'Githunguri', 'Gatundu South', 'Gatundu North', 'Lari'],
  'Mombasa': ['Nyali', 'Mvita', 'Kisauni', 'Likoni', 'Changamwe', 'Jomvu', 'Bamburi', 'Tudor'],
  'Nakuru': ['Nakuru Town East', 'Nakuru Town West', 'Naivasha', 'Gilgil', 'Rongai', 'Subukia', 'Molo', 'Njoro', 'Kuresoi North', 'Kuresoi South', 'Bahati'],
  'Kisumu': ['Kisumu Central', 'Kisumu East', 'Kisumu West', 'Nyando', 'Muhoroni', 'Seme', 'Nyakach', 'Milimani'],
  'Uasin Gishu': ['Ainabkoi (Eldoret)', 'Kapseret', 'Kesses', 'Moiben', 'Soy', 'Turbo'],
  'Machakos': ['Machakos Town', 'Mavoko (Athi River / Syokimau)', 'Kangundo', 'Matungulu', 'Kathiani', 'Yatta', 'Masinga', 'Mwala'],
  'Kajiado': ['Kajiado North (Ngong/Rongai)', 'Kajiado East (Kitengela)', 'Kajiado Central', 'Kajiado West', 'Kajiado South (Loitokitok)'],
  'Nyeri': ['Nyeri Town', 'Tetu', 'Kieni East', 'Kieni West', 'Mathira East', 'Mathira West', 'Othaya', 'Mukurwe-ini'],
  'Kilifi': ['Kilifi North', 'Kilifi South', 'Malindi', 'Magarini', 'Kaloleni', 'Rabai', 'Ganze', 'Watamu'],
  'Kwale': ['Matuga', 'Msambweni (Diani)', 'Kinango', 'Lunga Lunga'],
  'Meru': ['Imenti North', 'Imenti South', 'Central Imenti', 'Buuri', 'Tigania East', 'Tigania West', 'Igembe North', 'Igembe South', 'Igembe Central'],
  'Kakamega': ['Lurambi (Kakamega)', 'Malava', 'Lugari', 'Navakholo', 'Mumias East', 'Mumias West', 'Matungu', 'Butere', 'Khwisero', 'Shinyalu', 'Ikolomani'],
  'Kisii': ['Kitutu Chache North', 'Kitutu Chache South', 'Nyaribari Masaba', 'Nyaribari Chache', 'Bomachoge Borabu', 'Bomachoge Chache', 'Bobasi', 'South Mugirango', 'Bonchari'],
  'Bungoma': ['Kanduyi', 'Bumula', 'Sirisia', 'Kabuchai', 'Webuye East', 'Webuye West', 'Tongaren', 'Kimilili', 'Mt. Elgon'],
  'Laikipia': ['Laikipia East (Nanyuki)', 'Laikipia West', 'Laikipia North'],
  'Murang\'a': ['Kiharu', 'Maragua', 'Kandara', 'Gatanga', 'Kangema', 'Mathioya', 'Kigumo'],
  'Kirinyaga': ['Kirinyaga Central (Kerugoya)', 'Gichugu', 'Ndia', 'Mwea East', 'Mwea West'],
  'Embu': ['Manyatta', 'Runyenjes', 'Mbeere North', 'Mbeere South'],
  'Kitui': ['Kitui Central', 'Kitui West', 'Kitui East', 'Kitui Rural', 'Kitui South', 'Mwingi North', 'Mwingi Central', 'Mwingi West'],
  'Makueni': ['Makueni (Wote)', 'Kaiti', 'Mbooni', 'Kilome', 'Kibwezi East', 'Kibwezi West'],
  'Narok': ['Narok North', 'Narok South', 'Narok East', 'Narok West', 'Kilgoris', 'Emurua Dikirr'],
  'Trans Nzoia': ['Cherangany', 'Kwanza', 'Saboti (Kitale)', 'Endebess', 'Kiminini'],
  'Kericho': ['Ainamoi (Kericho)', 'Belgut', 'Bureti', 'Kipkelion East', 'Kipkelion West', 'Soin/Sigowet'],
  'Bomet': ['Bomet Central', 'Bomet East', 'Sotik', 'Chepalungu', 'Konoin'],
  'Homa Bay': ['Homa Bay Town', 'Ndhiwa', 'Mbita', 'Rangwe', 'Karachuonyo', 'Kasipul', 'Kabondo Kasipul', 'Suba'],
  'Migori': ['Suna East', 'Suna West', 'Uriri', 'Rongo', 'Awendo', 'Kuria East', 'Kuria West', 'Nyatike'],
  'Siaya': ['Alego Usonga', 'Gem', 'Ugenya', 'Ugunja', 'Bondo', 'Rarieda'],
  'Vihiga': ['Vihiga (Mbale)', 'Sabatia', 'Hamisi', 'Luanda', 'Emuhaya'],
  'Busia': ['Matayos', 'Teso North', 'Teso South', 'Nambale', 'Butula', 'Funyula', 'Budalangi'],
  'Nandi': ['Emgwen (Kapsabet)', 'Mosop', 'Chesumei', 'Nandi Hills', 'Aldai', 'Tinderet'],
  'Baringo': ['Baringo Central (Kabarnet)', 'Baringo North', 'Baringo South', 'Eldama Ravine', 'Mogotio', 'Tiaty'],
  'Elgeyo Marakwet': ['Keiyo North (Iten)', 'Keiyo South', 'Marakwet East', 'Marakwet West'],
  'Nyandarua': ['Ol Kalou', 'Kinangop', 'Kipipiri', 'Ol Joro Orok', 'Ndaragwa'],
  'Tharaka-Nithi': ['Chuka/Igambang\'ombe', 'Maara', 'Tharaka'],
  'Nyamira': ['Nyamira Town', 'West Mugirango', 'North Mugirango', 'Borabu', 'Manga'],
  'Taita Taveta': ['Voi', 'Wundanyi', 'Mwatate', 'Taveta'],
  'Garissa': ['Garissa Township', 'Dadaab', 'Fafi', 'Ijara', 'Balambala', 'Lagdera'],
  'Wajir': ['Wajir East', 'Wajir West', 'Wajir North', 'Wajir South', 'Tarbaj', 'Eldas'],
  'Mandera': ['Mandera East', 'Mandera West', 'Mandera North', 'Mandera South', 'Banissa', 'Lafey'],
  'Marsabit': ['Saku (Marsabit Town)', 'Laisamis', 'North Horr', 'Moyale'],
  'Isiolo': ['Isiolo North', 'Isiolo South'],
  'Turkana': ['Turkana Central (Lodwar)', 'Turkana North', 'Turkana South', 'Turkana West', 'Turkana East', 'Loima'],
  'West Pokot': ['Kapenguria', 'Sigor', 'Kacheliba', 'Pokot South'],
  'Samburu': ['Samburu West (Maralal)', 'Samburu East', 'Samburu North'],
  'Tana River': ['Galole (Hola)', 'Bura', 'Garsen'],
  'Lamu': ['Lamu West', 'Lamu East'],
};

export interface MatchedTechnician {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  rank: TechnicianRank;
  rating: number;
  reviewsCount: number;
  specialization: string;
  homeCounty: string;
  baseLocationName: string;
  coordinates: GeoCoordinate;
  distanceKm: number;
  travelMinutes: number;
  availability: 'Available Immediately' | 'Available Tomorrow' | 'Booked 24h Ahead';
  certifiedModules: string[];
}

export interface SupplierHub {
  id: string;
  name: string;
  city: string;
  address: string;
  coordinates: GeoCoordinate;
  hardwareStockReady: boolean;
  transitHoursToSite: number;
}

export interface LocationCalculationResult {
  customerCounty: string;
  customerCoords: GeoCoordinate;
  nearestSupplierHub: SupplierHub;
  supplierDistanceKm: number;
  matchedTechnician: MatchedTechnician;
  technicianDistanceKm: number;
  technicianTravelMinutes: number;
  zone: TravelZone;
  zoneCode: 'A' | 'B' | 'C' | 'D';
  siteSurveyFeeKES: number;
  isSurveyFeeCustom: boolean;
  travelSurchargeKES: number;
  deploymentComplexity: 'Standard Urban' | 'Peri-Urban Corridor' | 'Regional Extended' | 'Remote Complex Logistics';
  estimatedArrivalDays: string;
  coverageEligible: boolean;
  googleMapsDirectionsUrl: string;
}

// 47 Kenyan Counties with geographic centers and primary urban hubs
export const KENYA_COUNTY_COORDINATES: Record<string, { lat: number; lng: number; hubTown: string; defaultTechBase: string }> = {
  'Nairobi': { lat: -1.286389, lng: 36.817223, hubTown: 'Nairobi CBD / Westlands', defaultTechBase: 'Nairobi Central Depot' },
  'Mombasa': { lat: -4.043477, lng: 39.668206, hubTown: 'Mombasa City / Nyali', defaultTechBase: 'Coast Regional Hub' },
  'Kiambu': { lat: -1.171389, lng: 36.835556, hubTown: 'Kiambu / Thika', defaultTechBase: 'Thika Highway Hub' },
  'Nakuru': { lat: -0.303099, lng: 36.080026, hubTown: 'Nakuru City', defaultTechBase: 'Rift Valley Regional Hub' },
  'Kisumu': { lat: -0.091702, lng: 34.767956, hubTown: 'Kisumu City', defaultTechBase: 'Lake Basin Tech Center' },
  'Uasin Gishu': { lat: 0.514277, lng: 35.26978, hubTown: 'Eldoret City', defaultTechBase: 'North Rift Depot' },
  'Machakos': { lat: -1.517684, lng: 37.263415, hubTown: 'Machakos Town / Athi River', defaultTechBase: 'Eastern Metro Hub' },
  'Kajiado': { lat: -1.85238, lng: 36.77683, hubTown: 'Kitengela / Ngong / Kajiado', defaultTechBase: 'South Metro Hub' },
  'Nyeri': { lat: -0.42013, lng: 36.94759, hubTown: 'Nyeri Town', defaultTechBase: 'Mount Kenya Hub' },
  'Kilifi': { lat: -3.63045, lng: 39.84992, hubTown: 'Kilifi / Malindi', defaultTechBase: 'Coast North Hub' },
  'Kwale': { lat: -4.17366, lng: 39.45206, hubTown: 'Diani / Kwale', defaultTechBase: 'Coast South Hub' },
  'Murang\'a': { lat: -0.721, lng: 37.152, hubTown: 'Murang\'a Town / Kenol', defaultTechBase: 'Central Tech Depot' },
  'Kirinyaga': { lat: -0.498, lng: 37.28, hubTown: 'Kerugoya / Kutus', defaultTechBase: 'Central Tech Depot' },
  'Nyandarua': { lat: -0.18, lng: 36.37, hubTown: 'Ol Kalou', defaultTechBase: 'Rift Valley Depot' },
  'Laikipia': { lat: 0.05, lng: 37.07, hubTown: 'Nanyuki', defaultTechBase: 'Mount Kenya Hub' },
  'Meru': { lat: 0.046, lng: 37.655, hubTown: 'Meru Town', defaultTechBase: 'Meru Tech Center' },
  'Embu': { lat: -0.53, lng: 37.45, hubTown: 'Embu Town', defaultTechBase: 'Mount Kenya South Depot' },
  'Kitui': { lat: -1.36, lng: 38.01, hubTown: 'Kitui Town', defaultTechBase: 'Eastern Tech Depot' },
  'Makueni': { lat: -1.8, lng: 37.62, hubTown: 'Wote', defaultTechBase: 'Eastern Metro Hub' },
  'Tharaka-Nithi': { lat: -0.29, lng: 37.87, hubTown: 'Chuka', defaultTechBase: 'Meru Tech Center' },
  'Kakamega': { lat: 0.28, lng: 34.75, hubTown: 'Kakamega Town', defaultTechBase: 'Western Regional Hub' },
  'Bungoma': { lat: 0.56, lng: 34.56, hubTown: 'Bungoma Town', defaultTechBase: 'Western Regional Hub' },
  'Busia': { lat: 0.46, lng: 34.11, hubTown: 'Busia Town', defaultTechBase: 'Western Border Hub' },
  'Vihiga': { lat: 0.08, lng: 34.72, hubTown: 'Mbale', defaultTechBase: 'Western Regional Hub' },
  'Kisii': { lat: -0.68, lng: 34.77, hubTown: 'Kisii Town', defaultTechBase: 'South Nyanza Tech Depot' },
  'Nyamira': { lat: -0.56, lng: 34.93, hubTown: 'Nyamira Town', defaultTechBase: 'South Nyanza Tech Depot' },
  'Homa Bay': { lat: -0.52, lng: 34.45, hubTown: 'Homa Bay Town', defaultTechBase: 'Lake Basin Tech Center' },
  'Migori': { lat: -1.06, lng: 34.47, hubTown: 'Migori Town', defaultTechBase: 'South Nyanza Tech Depot' },
  'Siaya': { lat: 0.06, lng: 34.28, hubTown: 'Siaya Town', defaultTechBase: 'Lake Basin Tech Center' },
  'Kericho': { lat: -0.37, lng: 35.28, hubTown: 'Kericho Town', defaultTechBase: 'South Rift Depot' },
  'Bomet': { lat: -0.78, lng: 35.34, hubTown: 'Bomet Town', defaultTechBase: 'South Rift Depot' },
  'Narok': { lat: -1.08, lng: 35.87, hubTown: 'Narok Town', defaultTechBase: 'Maasai Mara Depot' },
  'Trans Nzoia': { lat: 1.01, lng: 35.0, hubTown: 'Kitale', defaultTechBase: 'North Rift Depot' },
  'Nandi': { lat: 0.18, lng: 35.1, hubTown: 'Kapsabet', defaultTechBase: 'North Rift Depot' },
  'Baringo': { lat: 0.48, lng: 35.74, hubTown: 'Kabarnet', defaultTechBase: 'Rift Valley Depot' },
  'Elgeyo Marakwet': { lat: 0.8, lng: 35.5, hubTown: 'Iten', defaultTechBase: 'North Rift Depot' },
  'West Pokot': { lat: 1.23, lng: 35.11, hubTown: 'Kapenguria', defaultTechBase: 'North Rift Extended' },
  'Turkana': { lat: 3.11, lng: 35.6, hubTown: 'Lodwar', defaultTechBase: 'Turkana Energy Station' },
  'Samburu': { lat: 1.17, lng: 36.69, hubTown: 'Maralal', defaultTechBase: 'Northern Frontier Station' },
  'Isiolo': { lat: 0.35, lng: 37.58, hubTown: 'Isiolo Town', defaultTechBase: 'LAPSSET Tech Depot' },
  'Marsabit': { lat: 2.33, lng: 37.99, hubTown: 'Marsabit Town', defaultTechBase: 'Northern Frontier Station' },
  'Garissa': { lat: -0.45, lng: 39.65, hubTown: 'Garissa Town', defaultTechBase: 'North Eastern Tech Hub' },
  'Wajir': { lat: 1.75, lng: 40.06, hubTown: 'Wajir Town', defaultTechBase: 'North Eastern Extended' },
  'Mandera': { lat: 3.93, lng: 41.86, hubTown: 'Mandera Town', defaultTechBase: 'North Eastern Extended' },
  'Taita Taveta': { lat: -3.31, lng: 38.35, hubTown: 'Voi', defaultTechBase: 'Coast Highway Depot' },
  'Tana River': { lat: -1.5, lng: 40.0, hubTown: 'Hola', defaultTechBase: 'Coast North Hub' },
  'Lamu': { lat: -2.27, lng: 40.9, hubTown: 'Lamu Island / Mokowe', defaultTechBase: 'Lamu Port Depot' },
};

// Verified Tier-1 Equipment Distribution Centers in Kenya
export const AUTHORIZED_SUPPLIER_HUBS: SupplierHub[] = [
  {
    id: 'sup-nbo-ind',
    name: 'HYNOVA Central Bonded Hub - Nairobi Industrial Area',
    city: 'Nairobi',
    address: 'Enterprise Road, Industrial Area, Nairobi',
    coordinates: { lat: -1.3105, lng: 36.8525 },
    hardwareStockReady: true,
    transitHoursToSite: 2,
  },
  {
    id: 'sup-mba-port',
    name: 'Coast Hardware Fulfillment - Mombasa Port Rd',
    city: 'Mombasa',
    address: 'Shimanzi / Port Reitz Road, Mombasa',
    coordinates: { lat: -4.0495, lng: 39.6455 },
    hardwareStockReady: true,
    transitHoursToSite: 3,
  },
  {
    id: 'sup-ksm-lake',
    name: 'Western & Lake Fulfillment Center - Kisumu',
    city: 'Kisumu',
    address: 'Obote Road, Industrial Zone, Kisumu',
    coordinates: { lat: -0.0985, lng: 34.755 },
    hardwareStockReady: true,
    transitHoursToSite: 4,
  },
  {
    id: 'sup-nkr-cbd',
    name: 'Central Rift Depot - Nakuru Wholesale Park',
    city: 'Nakuru',
    address: 'George Morara Avenue, Nakuru',
    coordinates: { lat: -0.2885, lng: 36.0715 },
    hardwareStockReady: true,
    transitHoursToSite: 3,
  },
  {
    id: 'sup-eld-nr',
    name: 'North Rift Tech Distribution Hub - Eldoret',
    city: 'Eldoret',
    address: 'Uganda Road, Eldoret',
    coordinates: { lat: 0.518, lng: 35.275 },
    hardwareStockReady: true,
    transitHoursToSite: 4,
  },
];

// Certified Technicians Network Pool with Verified Specializations
export const VERIFIED_TECHNICIAN_POOL: MatchedTechnician[] = [
  {
    id: 'tech-001',
    name: 'Brian Mwangi Kibet',
    phone: '+254 722 000 148',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    rank: 'Specialist Technician',
    rating: 4.96,
    reviewsCount: 84,
    specialization: 'Solar Microgrids & CCTV AcuSense',
    homeCounty: 'Nairobi',
    baseLocationName: 'Westlands / Parklands Hub',
    coordinates: { lat: -1.268, lng: 36.808 },
    distanceKm: 0,
    travelMinutes: 0,
    availability: 'Available Immediately',
    certifiedModules: ['EPRA T2 Solar PV', 'Hikvision Certified Security', 'Safety & Data Privacy'],
  },
  {
    id: 'tech-002',
    name: 'Dennis Ochieng Otieno',
    phone: '+254 733 999 215',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    rank: 'Master Technician',
    rating: 4.98,
    reviewsCount: 142,
    specialization: 'Enterprise Fiber, Starlink & Biometric Gate Automation',
    homeCounty: 'Machakos',
    baseLocationName: 'Athi River / Syokimau Base',
    coordinates: { lat: -1.438, lng: 36.965 },
    distanceKm: 0,
    travelMinutes: 0,
    availability: 'Available Immediately',
    certifiedModules: ['NCA Electrical Works', 'Centurion Smart Gate Certified', 'Customer Service & Conduct'],
  },
  {
    id: 'tech-003',
    name: 'Faith Chebet Korir',
    phone: '+254 711 345 889',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    rank: 'Senior Technician',
    rating: 4.92,
    reviewsCount: 68,
    specialization: 'Commercial AI Surveillance & Perimeter Alarms',
    homeCounty: 'Kiambu',
    baseLocationName: 'Ruiru / Thika Road Corridor',
    coordinates: { lat: -1.148, lng: 36.958 },
    distanceKm: 0,
    travelMinutes: 0,
    availability: 'Available Tomorrow',
    certifiedModules: ['Hikvision AI Systems', 'Wi-Fi 6 Mesh Integration', 'Site Safety & PPE'],
  },
  {
    id: 'tech-004',
    name: 'Hamisi Bakari Mwatela',
    phone: '+254 720 882 190',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    rank: 'Master Technician',
    rating: 4.95,
    reviewsCount: 112,
    specialization: 'Off-Grid Coastal Solar & Marine Surveillance',
    homeCounty: 'Mombasa',
    baseLocationName: 'Nyali / Diani Coast Hub',
    coordinates: { lat: -4.035, lng: 39.712 },
    distanceKm: 0,
    travelMinutes: 0,
    availability: 'Available Immediately',
    certifiedModules: ['EPRA T3 Solar PV', 'Marine IP68 Weatherproofing', 'Platform Protocols'],
  },
  {
    id: 'tech-005',
    name: 'Samuel Kiprop Cheruiyot',
    phone: '+254 725 441 332',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=256&q=80',
    rank: 'Senior Technician',
    rating: 4.91,
    reviewsCount: 57,
    specialization: 'Agribusiness Solar Water Telemetry & Hybrid Power',
    homeCounty: 'Nakuru',
    baseLocationName: 'Nakuru Town / Naivasha Hub',
    coordinates: { lat: -0.295, lng: 36.068 },
    distanceKm: 0,
    travelMinutes: 0,
    availability: 'Available Immediately',
    certifiedModules: ['EPRA Solar Pumping', 'IoT Telemetry Sensors', 'Professional Conduct'],
  },
  {
    id: 'tech-006',
    name: 'Kennedy Omondi Aloo',
    phone: '+254 712 990 771',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&q=80',
    rank: 'Specialist Technician',
    rating: 4.94,
    reviewsCount: 76,
    specialization: 'Hospitality Wi-Fi 6 & Security Command Centers',
    homeCounty: 'Kisumu',
    baseLocationName: 'Milimani / Kisumu Central Depot',
    coordinates: { lat: -0.095, lng: 34.76 },
    distanceKm: 0,
    travelMinutes: 0,
    availability: 'Available Tomorrow',
    certifiedModules: ['Enterprise Wi-Fi Mesh', 'CCTV Video Walls', 'Data Privacy Standards'],
  },
];

export class GoogleMapsEngineService {
  /**
   * Great-Circle Haversine Formula with Road Winding Multiplier (~1.25)
   */
  static calculateDistanceKm(coord1: GeoCoordinate, coord2: GeoCoordinate): number {
    const R = 6371; // Earth radius in km
    const dLat = (coord2.lat - coord1.lat) * (Math.PI / 180);
    const dLng = (coord2.lng - coord1.lng) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(coord1.lat * (Math.PI / 180)) *
        Math.cos(coord2.lat * (Math.PI / 180)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const straightLineKm = R * c;
    // Real Kenyan highway/road factor: 1.22 in urban corridors, 1.30 in rural
    return Math.round(straightLineKm * 1.25 * 10) / 10;
  }

  /**
   * Estimates road driving travel time in minutes
   */
  static estimateTravelMinutes(distanceKm: number): number {
    if (distanceKm <= 15) {
      // Urban traffic: ~25 km/h average
      return Math.round((distanceKm / 25) * 60) + 10;
    }
    if (distanceKm <= 40) {
      // Peri-urban: ~45 km/h average
      return Math.round((distanceKm / 45) * 60) + 15;
    }
    // Highway speed: ~65 km/h average
    return Math.round((distanceKm / 65) * 60) + 20;
  }

  /**
   * Normalizes county string name to key
   */
  static normalizeCounty(countyInput: string): string {
    const cleaned = countyInput.replace(/County/i, '').trim();
    for (const key of Object.keys(KENYA_COUNTY_COORDINATES)) {
      if (key.toLowerCase().includes(cleaned.toLowerCase()) || cleaned.toLowerCase().includes(key.toLowerCase())) {
        return key;
      }
    }
    return 'Nairobi';
  }

  /**
   * Classifies Travel Zone per Operating Agreement Section 3 & 4
   */
  static getTravelZone(distanceKm: number): {
    zone: TravelZone;
    zoneCode: 'A' | 'B' | 'C' | 'D';
    siteSurveyFeeKES: number;
    isCustom: boolean;
    travelSurchargeKES: number;
    deploymentComplexity: 'Standard Urban' | 'Peri-Urban Corridor' | 'Regional Extended' | 'Remote Complex Logistics';
    estimatedArrivalDays: string;
  } {
    if (distanceKm <= 15) {
      return {
        zone: 'Zone A (0–15 KM)',
        zoneCode: 'A',
        siteSurveyFeeKES: 1000,
        isCustom: false,
        travelSurchargeKES: 0,
        deploymentComplexity: 'Standard Urban',
        estimatedArrivalDays: 'Within 24 Hours (Same Day Dispatch Eligible)',
      };
    }
    if (distanceKm <= 40) {
      const surcharge = Math.round((distanceKm - 15) * 45); // KES 45/km outside Zone A
      return {
        zone: 'Zone B (15–40 KM)',
        zoneCode: 'B',
        siteSurveyFeeKES: 2000,
        isCustom: false,
        travelSurchargeKES: surcharge,
        deploymentComplexity: 'Peri-Urban Corridor',
        estimatedArrivalDays: 'Within 24 to 48 Hours',
      };
    }
    if (distanceKm <= 100) {
      const surcharge = Math.round((distanceKm - 15) * 45);
      return {
        zone: 'Zone C (40–100 KM)',
        zoneCode: 'C',
        siteSurveyFeeKES: 3500,
        isCustom: false,
        travelSurchargeKES: surcharge,
        deploymentComplexity: 'Regional Extended',
        estimatedArrivalDays: 'Within 48 Hours',
      };
    }
    return {
      zone: 'Zone D (100+ KM)',
      zoneCode: 'D',
      siteSurveyFeeKES: 5000, // Indicative base, custom assessment applies
      isCustom: true,
      travelSurchargeKES: Math.round((distanceKm - 15) * 40),
      deploymentComplexity: 'Remote Complex Logistics',
      estimatedArrivalDays: 'Scheduled Priority Dispatch (2 to 4 Days)',
    };
  }

  /**
   * 4-Priority Technician Matching Algorithm
   * Priority 1: Nearest certified technician
   * Priority 2: Highest rated technician
   * Priority 3: Availability
   * Priority 4: Required specialization
   */
  static matchTechnician(
    customerCoords: GeoCoordinate,
    requiredSpecialization?: string
  ): MatchedTechnician {
    const candidates = VERIFIED_TECHNICIAN_POOL.map((tech) => {
      const dist = this.calculateDistanceKm(tech.coordinates, customerCoords);
      const minutes = this.estimateTravelMinutes(dist);
      return {
        ...tech,
        distanceKm: dist,
        travelMinutes: minutes,
      };
    });

    // Score based on the 4 mandatory priorities:
    // Priority 1: Distance (0 to 100 points, lower distance = more points)
    // Priority 2: Rating (up to 40 points)
    // Priority 3: Availability (Immediate = 20 pts, Tomorrow = 10 pts)
    // Priority 4: Specialization match (up to 20 pts)
    const scored = candidates.map((cand) => {
      let score = Math.max(0, 100 - cand.distanceKm * 0.5);
      score += cand.rating * 8; // e.g. 4.96 * 8 = 39.68 pts
      if (cand.availability === 'Available Immediately') score += 20;
      else if (cand.availability === 'Available Tomorrow') score += 10;

      if (requiredSpecialization) {
        const specMatch = cand.specialization.toLowerCase().includes(requiredSpecialization.toLowerCase());
        if (specMatch) score += 20;
      }
      return { candidate: cand, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored[0].candidate;
  }

  /**
   * Finds the nearest Authorized Equipment Supplier Hub
   */
  static findNearestSupplierHub(customerCoords: GeoCoordinate): { hub: SupplierHub; distanceKm: number } {
    let bestHub = AUTHORIZED_SUPPLIER_HUBS[0];
    let minDistance = Infinity;

    for (const hub of AUTHORIZED_SUPPLIER_HUBS) {
      const dist = this.calculateDistanceKm(hub.coordinates, customerCoords);
      if (dist < minDistance) {
        minDistance = dist;
        bestHub = hub;
      }
    }
    return { hub: bestHub, distanceKm: minDistance };
  }

  /**
   * Finds the nearest HYNOVA Regional Service Hub
   */
  static findNearestServiceHub(coords: GeoCoordinate): { hub: ServiceZoneHub; distanceKm: number } {
    let bestHub = HYNOVA_REGIONAL_HUBS[0];
    let minDistance = Infinity;

    for (const hub of HYNOVA_REGIONAL_HUBS) {
      const dist = this.calculateDistanceKm(hub.coordinates, coords);
      if (dist < minDistance) {
        minDistance = dist;
        bestHub = hub;
      }
    }
    return { hub: bestHub, distanceKm: minDistance };
  }

  /**
   * Retrieves sub-counties for a given Kenyan County
   */
  static getSubCounties(countyInput: string): string[] {
    const normalized = this.normalizeCounty(countyInput);
    return KENYA_SUB_COUNTIES[normalized] || [
      `${normalized} Central`,
      `${normalized} North`,
      `${normalized} South`,
      `${normalized} East`,
      `${normalized} West`,
    ];
  }

  /**
   * Builds a verified, immutable HynovaLocationRecord linked to project lifecycle
   */
  static createLocationRecord(params: {
    lat: number;
    lng: number;
    county: string;
    subCounty?: string;
    townOrArea?: string;
    fullAddress?: string;
    googlePlaceId?: string;
    postalAddress?: string;
    permissionStatus?: LocationPermissionStatus;
    source?: LocationSource;
    isDifferentInstallationLocation?: boolean;
    recipientContact?: LocationRecipientContact;
    requiredSpecialty?: string;
    confirmedByCustomer?: boolean;
    entityLinks?: {
      customerId?: string;
      quoteId?: string;
      orderId?: string;
      siteSurveyId?: string;
      jobId?: string;
      dispatchId?: string;
      maintenancePlanId?: string;
      warrantyRecordId?: string;
    };
  }): HynovaLocationRecord {
    const normalizedCounty = this.normalizeCounty(params.county);
    const coords: GeoCoordinate = { lat: params.lat, lng: params.lng };
    const source: LocationSource = params.source || 'MANUAL_MAP_PIN';
    const permissionStatus: LocationPermissionStatus = params.permissionStatus || 'MANUAL';

    // 1. Calculate Confidence Score
    let confidenceScore = 85;
    let confidenceLabel = 'Landmark / Visual Pin Placement (85%)';
    let surveyRecommendation: 'WAIVED_ELIGIBLE' | 'OPTIONAL' | 'RECOMMENDED' | 'MANDATORY' = 'RECOMMENDED';
    let surveyReason = 'Customer visually dropped pin on Google Maps. Site survey recommended to verify exact cable pathways and structural mounting.';

    if (source === 'GPS_CURRENT_LOCATION') {
      confidenceScore = 100;
      confidenceLabel = 'GPS Confirmed (100% Confidence)';
      surveyRecommendation = 'WAIVED_ELIGIBLE';
      surveyReason = 'High-precision native GPS coordinate lock obtained directly from customer device.';
    } else if (source === 'SEARCH_AUTOCOMPLETE') {
      confidenceScore = 95;
      confidenceLabel = 'Google Maps Address Match (95% Confidence)';
      surveyRecommendation = 'OPTIONAL';
      surveyReason = 'Verified Google Maps Place ID and street address match in Google Maps directory.';
    } else if (source === 'COUNTY_DEFAULT') {
      confidenceScore = 40;
      confidenceLabel = 'Regional County Baseline Only (40% Confidence)';
      surveyRecommendation = 'MANDATORY';
      surveyReason = 'Coordinates set to general county centroid. Mandatory physical site survey required before final quote generation.';
    }

    // 2. Nearest Service Zone Hub
    const nearestHubInfo = this.findNearestServiceHub(coords);

    // 3. Nearest Technician Match
    const matchedTechnician = this.matchTechnician(coords, params.requiredSpecialty);
    const techDist = matchedTechnician.distanceKm;
    const travelTime = matchedTechnician.travelMinutes;

    // 4. Travel Zone Classification
    const zoneInfo = this.getTravelZone(techDist);

    // 5. Logistics Multiplier and Maintenance Visit Cost
    let logisticsMultiplier = 1.0;
    let maintenanceCost = 2500;
    if (zoneInfo.zoneCode === 'B') {
      logisticsMultiplier = 1.08;
      maintenanceCost = 3800;
    } else if (zoneInfo.zoneCode === 'C') {
      logisticsMultiplier = 1.15;
      maintenanceCost = 5500;
    } else if (zoneInfo.zoneCode === 'D') {
      logisticsMultiplier = 1.25;
      maintenanceCost = 8500;
    }

    // Compose human address if empty
    const fullAddress = params.fullAddress || 
      `${params.townOrArea ? params.townOrArea + ', ' : ''}${params.subCounty ? params.subCounty + ', ' : ''}${normalizedCounty} County, Kenya`;

    const recordId = `LOC-HYN-${Math.floor(100000 + Math.random() * 900000)}`;

    const locationRecord: HynovaLocationRecord = {
      id: recordId,
      customerId: params.entityLinks?.customerId,
      quoteId: params.entityLinks?.quoteId,
      orderId: params.entityLinks?.orderId,
      siteSurveyId: params.entityLinks?.siteSurveyId,
      jobId: params.entityLinks?.jobId,
      dispatchId: params.entityLinks?.dispatchId,
      maintenancePlanId: params.entityLinks?.maintenancePlanId,
      warrantyRecordId: params.entityLinks?.warrantyRecordId,

      lat: params.lat,
      lng: params.lng,
      googlePlaceId: params.googlePlaceId,
      fullAddress,
      county: `${normalizedCounty} County`,
      subCounty: params.subCounty,
      townOrArea: params.townOrArea,
      postalAddress: params.postalAddress,
      timestamp: new Date().toISOString(),

      permissionStatus,
      source,

      confidenceScore,
      confidenceLabel,
      surveyRecommendation,
      surveyReason,

      isDifferentInstallationLocation: !!params.isDifferentInstallationLocation,
      recipientContact: params.recipientContact,

      distanceFromZoneKm: nearestHubInfo.distanceKm,
      nearestZoneName: nearestHubInfo.hub.name,
      distanceFromTechnicianKm: techDist,
      nearestTechnicianId: matchedTechnician.id,
      nearestTechnicianName: matchedTechnician.name,
      nearestTechnicianRank: matchedTechnician.rank,
      estimatedTravelKm: techDist,
      estimatedTravelTimeMinutes: travelTime,
      serviceZoneTier: zoneInfo.zone,
      travelChargesKES: zoneInfo.travelSurchargeKES,
      siteSurveyFeeKES: zoneInfo.siteSurveyFeeKES,
      logisticsMultiplier,
      maintenanceVisitCostKES: maintenanceCost,

      confirmedByCustomer: !!params.confirmedByCustomer,
      confirmedAt: params.confirmedByCustomer ? new Date().toISOString() : undefined,
    };

    // Auto-persist in location store
    this.saveLocationRecord(locationRecord);

    return locationRecord;
  }

  /**
   * Persists location record in localStorage
   */
  static saveLocationRecord(record: HynovaLocationRecord): void {
    try {
      const existing = this.getAllLocationRecords();
      const updated = [record, ...existing.filter((r) => r.id !== record.id)].slice(0, 100);
      localStorage.setItem('hynova_location_records_v1', JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not save location record to localStorage:', e);
    }
  }

  /**
   * Retrieves all saved location records
   */
  static getAllLocationRecords(): HynovaLocationRecord[] {
    try {
      const data = localStorage.getItem('hynova_location_records_v1');
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // Fallback
    }
    return [];
  }

  /**
   * Retrieves single location record by ID
   */
  static getLocationRecord(id: string): HynovaLocationRecord | null {
    const all = this.getAllLocationRecords();
    return all.find((r) => r.id === id) || null;
  }

  /**
   * Full Google Maps Operational Calculation
   */
  static calculateDeploymentLogistics(
    countyName: string,
    specificAddressOrTown?: string,
    requiredSpecialty?: string,
    customCoords?: GeoCoordinate
  ): LocationCalculationResult {
    const normalized = this.normalizeCounty(countyName);
    const countyData = KENYA_COUNTY_COORDINATES[normalized] || KENYA_COUNTY_COORDINATES['Nairobi'];
    const customerCoords: GeoCoordinate = customCoords || { lat: countyData.lat, lng: countyData.lng };

    // Nearest Supplier
    const { hub: nearestSupplierHub, distanceKm: supplierDistanceKm } = this.findNearestSupplierHub(customerCoords);

    // Matched Technician
    const matchedTechnician = this.matchTechnician(customerCoords, requiredSpecialty);
    const technicianDistanceKm = matchedTechnician.distanceKm;
    const technicianTravelMinutes = matchedTechnician.travelMinutes;

    // Travel Zone
    const zoneInfo = this.getTravelZone(technicianDistanceKm);

    // Google Maps Directions link
    const origin = encodeURIComponent(`${matchedTechnician.coordinates.lat},${matchedTechnician.coordinates.lng}`);
    const destName = specificAddressOrTown
      ? `${specificAddressOrTown}, ${normalized}, Kenya`
      : `${countyData.hubTown}, ${normalized} County, Kenya`;
    const destination = encodeURIComponent(destName);
    const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;

    return {
      customerCounty: `${normalized} County`,
      customerCoords,
      nearestSupplierHub,
      supplierDistanceKm,
      matchedTechnician,
      technicianDistanceKm,
      technicianTravelMinutes,
      zone: zoneInfo.zone,
      zoneCode: zoneInfo.zoneCode,
      siteSurveyFeeKES: zoneInfo.siteSurveyFeeKES,
      isSurveyFeeCustom: zoneInfo.isCustom,
      travelSurchargeKES: zoneInfo.travelSurchargeKES,
      deploymentComplexity: zoneInfo.deploymentComplexity,
      estimatedArrivalDays: zoneInfo.estimatedArrivalDays,
      coverageEligible: true, // All 47 Counties Launch Coverage
      googleMapsDirectionsUrl,
    };
  }

  /**
   * Search matching Kenyan location (landmarks, estates, subcounties, coordinates)
   * Resolves instantly without requiring Google Places API billing
   */
  static searchKenyanLocations(query: string): {
    name: string;
    county: string;
    subCounty?: string;
    coords: GeoCoordinate;
    fullAddress: string;
  } | null {
    if (!query || !query.trim()) return null;
    const clean = query.trim();

    // 1. Check if user typed coordinates (e.g. -1.2863, 36.8172)
    const coordMatch = clean.match(/^(-?\d+(\.\d+)?)[,\s]+(-?\d+(\.\d+)?)$/);
    if (coordMatch) {
      const lat = parseFloat(coordMatch[1]);
      const lng = parseFloat(coordMatch[3]);
      if (lat >= -5 && lat <= 5 && lng >= 33 && lng <= 42) {
        return {
          name: `Custom Coordinates (${lat.toFixed(5)}, ${lng.toFixed(5)})`,
          county: 'Kenya Service Area',
          coords: { lat, lng },
          fullAddress: `Pinned GPS (${lat.toFixed(5)}, ${lng.toFixed(5)}), Kenya`,
        };
      }
    }

    // 2. Search popular landmarks
    const lower = clean.toLowerCase();
    const landmark = KENYA_POPULAR_LANDMARKS.find(
      (l) => l.name.toLowerCase().includes(lower) || lower.includes(l.name.toLowerCase())
    );
    if (landmark) {
      return {
        name: landmark.name,
        county: landmark.county,
        subCounty: landmark.subCounty,
        coords: { lat: landmark.lat, lng: landmark.lng },
        fullAddress: `${landmark.name}, ${landmark.subCounty}, ${landmark.county}, Kenya`,
      };
    }

    // 3. Search subcounties
    for (const [county, subs] of Object.entries(KENYA_SUB_COUNTIES)) {
      const matchedSub = subs.find(
        (s) => s.toLowerCase().includes(lower) || lower.includes(s.toLowerCase())
      );
      if (matchedSub) {
        const cCoords = KENYA_COUNTY_COORDINATES[county] || KENYA_COUNTY_COORDINATES['Nairobi'];
        return {
          name: matchedSub,
          county: `${county} County`,
          subCounty: matchedSub,
          coords: { lat: cCoords.lat, lng: cCoords.lng },
          fullAddress: `${matchedSub}, ${county} County, Kenya`,
        };
      }
    }

    // 4. Search counties
    for (const [county, cCoords] of Object.entries(KENYA_COUNTY_COORDINATES)) {
      if (county.toLowerCase().includes(lower) || lower.includes(county.toLowerCase())) {
        return {
          name: `${county} Hub`,
          county: `${county} County`,
          subCounty: cCoords.hubTown,
          coords: { lat: cCoords.lat, lng: cCoords.lng },
          fullAddress: `${cCoords.hubTown}, ${county} County, Kenya`,
        };
      }
    }

    return null;
  }
}

export const KENYA_POPULAR_LANDMARKS = [
  // Nairobi
  { name: 'Westlands CBD', county: 'Nairobi County', subCounty: 'Westlands', lat: -1.2642, lng: 36.8045 },
  { name: 'Karen Shopping Centre', county: 'Nairobi County', subCounty: 'Langata / Karen', lat: -1.3195, lng: 36.7065 },
  { name: 'Kilimani / Yaya Centre', county: 'Nairobi County', subCounty: 'Dagoretti North', lat: -1.2921, lng: 36.7865 },
  { name: 'Lavington Mall', county: 'Nairobi County', subCounty: 'Dagoretti North', lat: -1.2825, lng: 36.7725 },
  { name: 'Kileleshwa', county: 'Nairobi County', subCounty: 'Dagoretti North', lat: -1.2785, lng: 36.7885 },
  { name: 'Runda Estate', county: 'Nairobi County', subCounty: 'Westlands', lat: -1.2185, lng: 36.8195 },
  { name: 'Muthaiga Golf Club', county: 'Nairobi County', subCounty: 'Westlands', lat: -1.2585, lng: 36.8325 },
  { name: 'Upper Hill CBD', county: 'Nairobi County', subCounty: 'Kibra', lat: -1.2985, lng: 36.8145 },
  { name: 'South C / Bellevue', county: 'Nairobi County', subCounty: 'Langata', lat: -1.3185, lng: 36.8325 },
  { name: 'South B / Capital Centre', county: 'Nairobi County', subCounty: 'Starehe', lat: -1.3115, lng: 36.8425 },
  { name: 'Eastleigh / BBS Mall', county: 'Nairobi County', subCounty: 'Kamukunji', lat: -1.2785, lng: 36.8525 },
  { name: 'Parklands / Avenue Hospital', county: 'Nairobi County', subCounty: 'Westlands', lat: -1.2615, lng: 36.8185 },
  { name: 'Gigiri / UN Complex', county: 'Nairobi County', subCounty: 'Westlands', lat: -1.2335, lng: 36.8125 },
  { name: 'Roysambu / TRM Mall', county: 'Nairobi County', subCounty: 'Roysambu', lat: -1.2185, lng: 36.8885 },
  { name: 'Kasarani / SportsView', county: 'Nairobi County', subCounty: 'Kasarani', lat: -1.2235, lng: 36.9015 },
  { name: 'Embakasi / JKIA Airport', county: 'Nairobi County', subCounty: 'Embakasi East', lat: -1.3192, lng: 36.9275 },
  { name: 'Utawala / GSU Camp', county: 'Nairobi County', subCounty: 'Embakasi East', lat: -1.2885, lng: 36.9725 },
  // Kiambu
  { name: 'Ruiru Town', county: 'Kiambu County', subCounty: 'Ruiru', lat: -1.1458, lng: 36.9585 },
  { name: 'Ruaka / Two Rivers Mall', county: 'Kiambu County', subCounty: 'Kiambaa', lat: -1.2125, lng: 36.7925 },
  { name: 'Thika Town / Section 9', county: 'Kiambu County', subCounty: 'Thika Town', lat: -1.0396, lng: 37.0693 },
  { name: 'Kikuyu Town', county: 'Kiambu County', subCounty: 'Kikuyu', lat: -1.2465, lng: 36.6635 },
  { name: 'Juja City Mall', county: 'Kiambu County', subCounty: 'Juja', lat: -1.1085, lng: 37.0145 },
  // Machakos
  { name: 'Syokimau Gateway Mall', county: 'Machakos County', subCounty: 'Mavoko (Athi River / Syokimau)', lat: -1.3615, lng: 36.9245 },
  { name: 'Athi River / Signature Mall', county: 'Machakos County', subCounty: 'Mavoko (Athi River / Syokimau)', lat: -1.4392, lng: 36.9668 },
  { name: 'Machakos Town Centre', county: 'Machakos County', subCounty: 'Machakos Town', lat: -1.5177, lng: 37.2634 },
  // Kajiado
  { name: 'Kitengela Town', county: 'Kajiado County', subCounty: 'Kajiado East (Kitengela)', lat: -1.4785, lng: 36.9585 },
  { name: 'Ongata Rongai', county: 'Kajiado County', subCounty: 'Kajiado North (Ngong/Rongai)', lat: -1.3985, lng: 36.7585 },
  { name: 'Ngong Town', county: 'Kajiado County', subCounty: 'Kajiado North (Ngong/Rongai)', lat: -1.3615, lng: 36.6585 },
  // Nakuru & Rift Valley
  { name: 'Nakuru CBD / Westside Mall', county: 'Nakuru County', subCounty: 'Nakuru Town East', lat: -0.2833, lng: 36.0667 },
  { name: 'Naivasha Town Centre', county: 'Nakuru County', subCounty: 'Naivasha', lat: -0.7172, lng: 36.4310 },
  { name: 'Naivasha South Lake Road', county: 'Nakuru County', subCounty: 'Naivasha', lat: -0.7685, lng: 36.3885 },
  { name: 'Eldoret CBD / Rupa Mall', county: 'Uasin Gishu County', subCounty: 'Ainabkoi (Eldoret)', lat: 0.5143, lng: 35.2698 },
  // Coast
  { name: 'Mombasa CBD / Digo Road', county: 'Mombasa County', subCounty: 'Mvita', lat: -4.0435, lng: 39.6682 },
  { name: 'Nyali Beach / City Mall', county: 'Mombasa County', subCounty: 'Nyali', lat: -4.0185, lng: 39.7125 },
  { name: 'Bamburi / Haller Park', county: 'Mombasa County', subCounty: 'Kisauni', lat: -3.9985, lng: 39.7225 },
  { name: 'Diani Beach / Ukunda', county: 'Kwale County', subCounty: 'Msambweni (Diani)', lat: -4.2885, lng: 39.5785 },
  { name: 'Malindi Town / Seafront', county: 'Kilifi County', subCounty: 'Malindi', lat: -3.2185, lng: 40.1185 },
  // Western & Nyanza
  { name: 'Kisumu CBD / Mega Plaza', county: 'Kisumu County', subCounty: 'Kisumu Central', lat: -0.0917, lng: 34.7680 },
  { name: 'Milimani / Tom Mboya Kisumu', county: 'Kisumu County', subCounty: 'Kisumu Central', lat: -0.1045, lng: 34.7565 },
  { name: 'Kakamega Town / Bukhungu', county: 'Kakamega County', subCounty: 'Lurambi (Kakamega)', lat: 0.2827, lng: 34.7519 },
  { name: 'Kisii Town Centre', county: 'Kisii County', subCounty: 'Nyaribari Chache', lat: -0.6773, lng: 34.7796 },
  // Central & Mount Kenya
  { name: 'Nyeri Town CBD', county: 'Nyeri County', subCounty: 'Nyeri Town', lat: -0.4201, lng: 36.9476 },
  { name: 'Nanyuki Town / Cedar Mall', county: 'Laikipia County', subCounty: 'Laikipia East (Nanyuki)', lat: 0.0167, lng: 37.0728 },
  { name: 'Meru Town Centre', county: 'Meru County', subCounty: 'Imenti North', lat: 0.0463, lng: 37.6559 },
];

