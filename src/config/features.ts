/**
 * HYNOVA ENTERPRISES — Operational Configuration & Feature Flags
 * 
 * GOOGLE MAPS BILLING SAFETY CONTROLS:
 * Google Maps interactive rendering, Google Places Autocomplete API, and automatic browser
 * geolocation are temporarily disabled to prevent Google Cloud billing charges until
 * administrative billing verification and authorized activation are complete.
 * 
 * FUTURE RESTORATION INSTRUCTIONS:
 * 1. Verify the Google Cloud project billing account is active and linked.
 * 2. Configure HTTP referrer restrictions on the Google Maps Platform API key.
 * 3. Set ENABLE_GOOGLE_MAPS_LOCATION_PICKER to true below (or set VITE_ENABLE_GOOGLE_MAPS=true in .env).
 * 4. Run automated tests to verify that tile loading and places requests succeed within set quotas.
 */

export const FEATURE_FLAGS = {
  /**
   * Temporarily disables automatic current-location detection and Google Maps API requests
   * that require active billing. Kept disabled until explicitly authorized.
   */
  ENABLE_GOOGLE_MAPS_LOCATION_PICKER: false,

  /**
   * Configured official HYNOVA business contacts
   */
  OFFICIAL_WHATSAPP_NUMBER: '254727547310',
  OFFICIAL_PHONE_DISPLAY: '+254 727 547 310',
  OFFICIAL_EMAIL: 'info@hynovaenterprises.com',
  OFFICIAL_WEBSITE_DOMAIN: 'hynovaenterprises.com',

  /**
   * Standard prefilled WhatsApp location sharing message
   */
  WHATSAPP_LOCATION_MESSAGE:
    'Hello, I am requesting a HYNOVA technology solution. I would like to share my installation location and discuss my project requirements.',
};
