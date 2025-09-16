// Google reCAPTCHA configuration
export const RECAPTCHA_CONFIG = {
  // Production site key
  SITE_KEY: '6LdtA8srAAAAAPfjIh0FJKuejVnhR1czZU2LoT09',
  
  // reCAPTCHA API URL
  API_URL: 'https://www.google.com/recaptcha/api.js',
  
  // Theme options: 'light' or 'dark'
  THEME: 'dark',
  
  // Size options: 'compact' or 'normal'
  SIZE: 'normal'
}

// Helper function to get the appropriate site key based on environment
export const getRecaptchaSiteKey = () => {
  // In production, you might want to use environment variables
  // return process.env.NODE_ENV === 'production' 
  //   ? process.env.REACT_APP_RECAPTCHA_SITE_KEY 
  //   : RECAPTCHA_CONFIG.SITE_KEY
  
  return RECAPTCHA_CONFIG.SITE_KEY
}