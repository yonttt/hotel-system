// Google reCAPTCHA configuration
export const RECAPTCHA_CONFIG = {
  // Test site key - works on localhost and returns always valid
  // Replace with your actual site key for production
  SITE_KEY: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
  
  // Production site key (replace this with your actual key)
  // SITE_KEY: 'your-production-site-key-here',
  
  // reCAPTCHA API URL
  API_URL: 'https://www.google.com/recaptcha/api.js',
  
  // Theme options: 'light' or 'dark'
  THEME: 'light',
  
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