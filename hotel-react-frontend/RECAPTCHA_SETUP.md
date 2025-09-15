# Google reCAPTCHA Integration Guide

## Overview
The Eva Group Hotel Management System now includes Google reCAPTCHA integration for enhanced security on the login page.

## Current Setup
- **Test Environment**: Uses Google's test site key that works on localhost
- **Test Site Key**: `6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI`
- **Features**: Validates user interaction before allowing login attempts

## Production Setup

### 1. Get Your reCAPTCHA Keys
1. Visit [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Create a new site with these settings:
   - **reCAPTCHA Type**: reCAPTCHA v2 (I'm not a robot checkbox)
   - **Domains**: Add your production domain(s)
   - **Owners**: Add your Google account

### 2. Update Configuration
Edit `/src/config/recaptcha.js`:

```javascript
export const RECAPTCHA_CONFIG = {
  // Replace with your production site key
  SITE_KEY: 'your-production-site-key-here',
  
  // Optional: Add environment-based configuration
  // SITE_KEY: process.env.REACT_APP_RECAPTCHA_SITE_KEY,
  
  THEME: 'light',     // 'light' or 'dark'
  SIZE: 'normal'      // 'normal' or 'compact'
}
```

### 3. Environment Variables (Recommended)
Create a `.env` file in your project root:

```env
REACT_APP_RECAPTCHA_SITE_KEY=your-production-site-key-here
```

Then update the configuration to use environment variables:

```javascript
export const getRecaptchaSiteKey = () => {
  return process.env.REACT_APP_RECAPTCHA_SITE_KEY || RECAPTCHA_CONFIG.SITE_KEY
}
```

### 4. Backend Validation (Optional)
For additional security, you can verify the reCAPTCHA token on your backend:

```python
import requests

def verify_recaptcha(token, secret_key):
    response = requests.post(
        'https://www.google.com/recaptcha/api/siteverify',
        data={
            'secret': secret_key,
            'response': token
        }
    )
    return response.json().get('success', False)
```

## Features
- ✅ **Test Mode**: Works immediately on localhost
- ✅ **Error Handling**: Shows user-friendly messages if reCAPTCHA fails to load
- ✅ **Auto-Reset**: Resets reCAPTCHA on login failure
- ✅ **Responsive**: Works on desktop and mobile devices
- ✅ **Accessible**: Follows Google's accessibility guidelines

## Troubleshooting

### reCAPTCHA Not Loading
- Check if the Google reCAPTCHA script is included in `index.html`
- Verify your domain is added to the reCAPTCHA configuration
- Check browser console for JavaScript errors

### Invalid Site Key
- Ensure you're using the correct site key for your domain
- Verify the site key is properly configured in `/src/config/recaptcha.js`

### Domain Mismatch
- Add your domain to the reCAPTCHA site configuration
- For development, `localhost` should be included

## Security Notes
- The test site key is only for development and will accept any solution
- Always use your own site key in production
- Consider implementing backend verification for additional security
- Monitor reCAPTCHA usage through Google's admin console

## Support
For issues with Google reCAPTCHA, refer to:
- [Google reCAPTCHA Documentation](https://developers.google.com/recaptcha)
- [reCAPTCHA FAQ](https://developers.google.com/recaptcha/docs/faq)