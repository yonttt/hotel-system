# reCAPTCHA Troubleshooting Guide

## Common Issues and Solutions

### 1. reCAPTCHA Not Showing/Rendering

**Symptoms:**
- The reCAPTCHA widget doesn't appear on the login page
- Empty space where reCAPTCHA should be

**Solutions:**

#### A. Verify Site Key Registration
1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Check if your site key is properly registered
3. Ensure your domain is in the authorized domains list:
   - For localhost: Add `localhost`
   - For production: Add your actual domain (e.g., `example.com`)

#### B. Check Browser Console for Errors
Open browser DevTools (F12) and check for:
- `Invalid site key` - Your site key is wrong or not registered
- `Permission denied` - Domain not whitelisted
- Network errors - Check internet connection or firewall

#### C. Clear Browser Cache
Sometimes cached reCAPTCHA scripts cause issues:
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh the page (Ctrl+F5)

#### D. Check CORS and Content Security Policy
If you're getting CORS errors:
- Ensure your server allows requests from Google's reCAPTCHA servers
- Check Content-Security-Policy headers

### 2. reCAPTCHA Shows But Doesn't Work

**Symptoms:**
- Widget appears but clicking doesn't do anything
- Can't complete the challenge

**Solutions:**

#### A. Check reCAPTCHA Version
This app uses reCAPTCHA v2 "I'm not a robot" checkbox
- Verify you're using v2 keys, not v3 keys
- v2 and v3 keys are NOT interchangeable

#### B. Check Network Connectivity
- Ensure access to Google's servers
- Check if your firewall/antivirus blocks Google domains

#### C. Test in Different Browser
- Try Chrome, Firefox, or Edge
- Disable browser extensions that might interfere

### 3. "Failed to load reCAPTCHA" Error

**Symptoms:**
- Error message appears on the login page
- Console shows loading timeout

**Solutions:**

#### A. Check Internet Connection
- Verify you can access google.com
- Test with: `ping www.google.com`

#### B. Check Script Loading
1. Open DevTools → Network tab
2. Refresh the page
3. Look for `recaptcha/api.js` request
4. If it fails, check:
   - Firewall settings
   - Ad blockers
   - DNS settings

### 4. Domain-Specific Issues

#### Localhost Testing
If testing locally:
```
1. Go to reCAPTCHA admin console
2. Edit your site key
3. Add "localhost" to domains
4. Save and wait a few minutes for propagation
```

#### Production Domain
```
1. Ensure domain matches exactly (with/without www)
2. Add both variations if needed:
   - example.com
   - www.example.com
3. Wait 5-10 minutes after adding domains
```

### 5. Getting Your Own reCAPTCHA Keys

If the current keys don't work, register your own:

1. Visit: https://www.google.com/recaptcha/admin/create
2. Fill in:
   - **Label**: Your app name (e.g., "Hotel Management System")
   - **reCAPTCHA type**: Select "reCAPTCHA v2" → "I'm not a robot" checkbox
   - **Domains**: Add your domains:
     ```
     localhost
     yourdomain.com
     www.yourdomain.com
     ```
3. Accept terms and submit
4. Copy the **Site Key** (public key)
5. Update `src/config/recaptcha.js`:
   ```javascript
   SITE_KEY: 'YOUR_NEW_SITE_KEY_HERE'
   ```

### 6. Testing reCAPTCHA

#### Quick Test
1. Open browser DevTools console
2. Run: `console.log(window.grecaptcha)`
3. Should see an object, not `undefined`

#### Verify Widget Rendering
1. After page loads, run:
   ```javascript
   console.log(document.querySelector('.g-recaptcha'))
   ```
2. Should see the reCAPTCHA div element

### 7. Environment Variables Setup (Optional but Recommended)

For better key management:

1. Copy `.env.example` to `.env`:
   ```powershell
   Copy-Item .env.example .env
   ```

2. Edit `.env` with your keys:
   ```
   VITE_RECAPTCHA_SITE_KEY=your_actual_site_key_here
   ```

3. Update `src/config/recaptcha.js`:
   ```javascript
   SITE_KEY: import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6LdtA8srAAAAAPfjIh0FJKuejVnhR1czZU2LoT09'
   ```

4. Restart the dev server for changes to take effect

### 8. Recent Fixes Applied

The following improvements have been made:

1. **Better initialization handling** - Fixed race conditions with grecaptcha loading
2. **Widget ID tracking** - Prevents duplicate rendering
3. **Error callbacks** - Added expired-callback and error-callback handlers
4. **Proper reset logic** - Correctly resets reCAPTCHA on form errors
5. **Theme change** - Changed from 'dark' to 'light' theme for better visibility

### 9. Still Not Working?

If none of the above solutions work:

1. **Check reCAPTCHA Status**: Visit https://www.google.com/recaptcha/admin to verify service status

2. **Try Test Keys**: Use Google's test keys for debugging:
   - Site key: `6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI`
   - Secret key: `6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe`
   
   Note: Test keys always pass validation - use only for testing!

3. **Temporarily Disable reCAPTCHA**:
   In `LoginPage.jsx`, comment out the validation:
   ```javascript
   // if (!recaptchaToken) {
   //   setError('Please complete the reCAPTCHA verification')
   //   return
   // }
   ```

4. **Contact Support**: If it's a persistent issue with your keys, contact Google reCAPTCHA support

## Additional Resources

- [Google reCAPTCHA Documentation](https://developers.google.com/recaptcha/docs/display)
- [reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
- [Stack Overflow reCAPTCHA Tag](https://stackoverflow.com/questions/tagged/recaptcha)

## Quick Checklist

Before asking for help, verify:
- [ ] Site key is correct in `config/recaptcha.js`
- [ ] Domain is whitelisted in reCAPTCHA admin
- [ ] Browser console shows no errors
- [ ] Internet connection is working
- [ ] Ad blockers are disabled
- [ ] Using correct reCAPTCHA version (v2)
- [ ] Tried in different browser
- [ ] Cleared cache and hard refreshed
