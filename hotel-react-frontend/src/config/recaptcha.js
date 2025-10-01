// Google reCAPTCHA configuration
// IMPORTANT: This site key must be registered for your domain at https://www.google.com/recaptcha/admin
// For localhost testing, make sure to add 'localhost' to the list of authorized domains
export const RECAPTCHA_CONFIG = {
  // reCAPTCHA v2 site key
  // If reCAPTCHA is not showing:
  // 1. Verify this key is registered for your domain
  // 2. Check browser console for errors
  // 3. Ensure the domain is whitelisted in Google reCAPTCHA admin
  SITE_KEY: '6LdtA8srAAAAAPfjIh0FJKuejVnhR1czZU2LoT09',
  
  // reCAPTCHA API URL (do not change)
  API_URL: 'https://www.google.com/recaptcha/api.js',
  
  // Theme options: 'light' or 'dark'
  THEME: 'light',
  
  // Size options: 'compact' or 'normal'
  SIZE: 'normal'
}

// Helper function to get the appropriate site key based on environment
export const getRecaptchaSiteKey = () => {
  // You can use environment variables for different environments:
  // return import.meta.env.VITE_RECAPTCHA_SITE_KEY || RECAPTCHA_CONFIG.SITE_KEY
  
  return RECAPTCHA_CONFIG.SITE_KEY
}