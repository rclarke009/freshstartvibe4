# Resend Email Troubleshooting Guide

## Common Issues and Solutions

### Issue: "Failed to send email: [error message]"

#### 1. Domain Verification Not Complete

**Symptoms:**
- Error message mentions "domain" or "from address"
- Email fails immediately

**Solutions:**
- Check Resend dashboard: https://resend.com/domains
- Verify domain status shows "Verified" (green checkmark)
- If still "Pending", check DNS records:
  - SPF record: `v=spf1 include:resend.com ~all`
  - DKIM records: Provided by Resend in domain settings
  - Verify DNS propagation: Use https://mxtoolbox.com/ to check records

**Temporary Fix:**
- If domain isn't verified yet, temporarily change the "from" address in `api.contact.ts`:
  ```typescript
  const fromEmail = 'Fresh Start Air Purifiers <onboarding@resend.dev>';
  ```
- This only works for testing - use your verified domain for production

#### 2. "From" Address Doesn't Match Verified Domain

**Symptoms:**
- Error: "Invalid from address" or "Domain not verified"

**Solutions:**
- The "from" address must use your verified domain
- If you verified `freshstartairpurifiers.com`, use `contact@freshstartairpurifiers.com`
- Check exact domain spelling (no typos)
- Ensure the domain in Resend matches exactly (including subdomain)

#### 3. API Key Issues

**Symptoms:**
- Error: "Unauthorized" or "Invalid API key"
- Error: "API key not found"

**Solutions:**
- Verify `RESEND_API_KEY` is set in Shopify Oxygen portal
- Check API key has "Sending access" permissions
- Regenerate API key if needed (old keys might be invalid)
- Ensure no extra spaces or quotes in the API key value

#### 4. Rate Limiting

**Symptoms:**
- Error: "Rate limit exceeded"
- Emails work sometimes but fail at other times

**Solutions:**
- Check Resend dashboard for rate limits
- Free tier: 3,000 emails/month, 100 emails/day
- Paid plans have higher limits
- Wait a few minutes and try again

#### 5. Account Issues

**Symptoms:**
- Error: "Account suspended" or "Payment required"
- No emails work at all

**Solutions:**
- Check Resend dashboard for account status
- Verify payment method is set up (if on paid plan)
- Check email quota hasn't been exceeded
- Contact Resend support if account is suspended

## Debugging Steps

### 1. Check Server Logs

Check your Shopify Oxygen deployment logs for detailed error messages:

1. Go to Shopify Partner Dashboard
2. Navigate to your Oxygen deployment
3. Click on "Logs" or "View Logs"
4. Look for error messages starting with "Resend API Error:" or "Error sending email:"

### 2. Verify Environment Variables

1. Check `RESEND_API_KEY` is set in Shopify Oxygen
2. Verify the API key value is correct (no extra spaces)
3. Check `CONTACT_EMAIL` if you set it (should be `contact@freshstartairpurifiers.com`)

### 3. Test API Key

You can test your API key using curl:

```bash
curl -X POST https://api.resend.com/emails \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "contact@freshstartairpurifiers.com",
    "to": "your-email@example.com",
    "subject": "Test Email",
    "text": "This is a test email"
  }'
```

Replace `YOUR_API_KEY` with your actual API key.

### 4. Check Domain Verification

1. Go to https://resend.com/domains
2. Click on your domain
3. Verify all DNS records are set correctly
4. Check DNS propagation using https://mxtoolbox.com/
5. Wait for DNS propagation (can take up to 48 hours)

### 5. Test with Resend Dashboard

1. Go to https://resend.com/emails
2. Click "Send Test Email"
3. Use your verified domain as the "from" address
4. If this works, the issue is likely in your code configuration
5. If this fails, the issue is with domain verification or API key

## Quick Fixes

### Fix 1: Use Test Domain Temporarily

If domain verification isn't complete, temporarily use Resend's test domain:

```typescript
// In api.contact.ts, change line 77:
const fromEmail = 'Fresh Start Air Purifiers <onboarding@resend.dev>';
```

**Note:** This only works for testing. You must use your verified domain for production.

### Fix 2: Verify API Key Format

Ensure your API key in Shopify Oxygen:
- Starts with `re_`
- Has no extra spaces or quotes
- Is the full key (not truncated)
- Has "Sending access" permissions

### Fix 3: Check Domain Spelling

Verify the domain in your code matches exactly:
- Domain in Resend: `freshstartairpurifiers.com`
- From address: `contact@freshstartairpurifiers.com`
- No typos or extra characters

## Getting Help

If none of these solutions work:

1. **Check Resend Dashboard:**
   - Go to https://resend.com
   - Check domain status
   - Check API key status
   - Check account status
   - Review recent email logs

2. **Check Server Logs:**
   - View detailed error messages in Shopify Oxygen logs
   - Look for specific Resend API error codes
   - Check for any additional error details

3. **Contact Resend Support:**
   - Email: support@resend.com
   - Include: API key (masked), domain name, error message, timestamp
   - Check Resend documentation: https://resend.com/docs

4. **Common Error Codes:**
   - `400`: Bad Request - Check email format, domain verification
   - `401`: Unauthorized - Check API key
   - `403`: Forbidden - Check API key permissions
   - `429`: Rate Limited - Wait and try again
   - `500`: Server Error - Check Resend status page

## Prevention

To avoid issues in the future:

1. **Verify Domain Before Deploying:**
   - Complete domain verification in Resend
   - Wait for DNS propagation (up to 48 hours)
   - Test sending emails from Resend dashboard

2. **Use Environment Variables:**
   - Store API key in Shopify Oxygen (not in code)
   - Use environment-specific email addresses if needed
   - Never commit API keys to git

3. **Monitor Email Quotas:**
   - Check Resend dashboard regularly
   - Set up email alerts for quota limits
   - Upgrade plan if needed

4. **Test Regularly:**
   - Test contact form regularly
   - Monitor error logs
   - Check email delivery rates

