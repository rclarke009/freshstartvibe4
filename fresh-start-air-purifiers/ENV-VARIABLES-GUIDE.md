# 🔐 How to Add Environment Variables to Shopify Oxygen Deployment

## Quick Steps

### Method 1: Shopify Partner Dashboard (Recommended)

1. **Go to Shopify Partner Dashboard**
   - Visit: https://partners.shopify.com
   - Login with your Shopify Partner account

2. **Navigate to Your Store**
   - Click on **Stores** in the left sidebar
   - Select your store (`rfbur0-m1.myshopify.com`)

3. **Find Your Oxygen Deployment**
   - Look for **Apps** or **Deployments** in the left sidebar
   - Click on your Hydrogen/Oxygen deployment
   - Or go to **Settings** → **Oxygen** (if available)

4. **Add Environment Variables**
   - Look for **Environment Variables** section
   - Click **Add Variable** or **Manage Variables**
   - Add the following variables:
     - **Variable Name:** `RESEND_API_KEY` (use this exact name - this is what the code expects)
     - **Variable Value:** Your actual Resend API key (the long string like `re_abc123...` that you copied from Resend)
     - **Variable Name:** `CONTACT_EMAIL` (optional)
     - **Variable Value:** `contact@freshstartairpurifiers.com` (or leave default)
   - **Note:** The variable NAME is `RESEND_API_KEY`, not the display name from Resend ("Fresh Start Contact Form")
   - Click **Save** or **Update**

5. **Redeploy (if needed)**
   - Some deployments auto-redeploy when variables are added
   - If not, trigger a new deployment from the dashboard

### Method 2: Using Shopify CLI

If you have the Shopify CLI installed and configured:

```bash
# Set a single environment variable
shopify hydrogen env set RESEND_API_KEY=your_api_key_here

# Set multiple variables
shopify hydrogen env set RESEND_API_KEY=your_key CONTACT_EMAIL=contact@freshstartairpurifiers.com

# List all environment variables
shopify hydrogen env list

# Remove an environment variable
shopify hydrogen env remove RESEND_API_KEY
```

### Method 3: Check Current Deployment Method

To see how your deployment is configured:

1. **Check your deployment settings** in the Shopify Partner Dashboard
2. **Look for an "Environment Variables" or "Config" section**
3. **Check if there's a `.oxygen` or `oxygen.json` file** in your project (some deployments use this)

## Required Environment Variables for Contact Form

Add these two environment variables to your Oxygen deployment:

1. **`RESEND_API_KEY`** (Required)
   - Get your API key from: https://resend.com/api-keys
   - **Important:** When creating the API key, select **"Sending access"** permissions only
   - This limits the key to sending emails only (security best practice)
   - Do NOT use "Full access" - this would allow the key to manage your account if compromised
   - This is required for the contact form to send emails

2. **`CONTACT_EMAIL`** (Optional)
   - Default: `info@freshstartairpurifiers.com`
   - This is where contact form submissions will be sent
   - Only set this if you want to use a different email address

### How to Create a Resend API Key with Sending Access Only

1. Go to https://resend.com/api-keys
2. Click **"Create API Key"**
3. Give it a descriptive name (e.g., "Fresh Start Contact Form") - **This is just a label in Resend, not the variable name**
4. **Select "Sending access"** as the permission level
5. (Optional) Restrict to a specific domain if you want additional security
6. Copy the API key value (a long string like `re_abc123...`) immediately (it's only shown once)
7. Store it securely and add it to your Shopify Oxygen deployment

### Important: Environment Variable Name vs Resend Key Name

- **Resend Key Name** (e.g., "Fresh Start Contact Form"): This is just a label in the Resend dashboard for your reference
- **Environment Variable Name**: This is what you set in Shopify Oxygen: `RESEND_API_KEY`
- **Environment Variable Value**: This is the actual API key string you copied from Resend (e.g., `re_abc123...`)

**In Shopify Oxygen, you set:**
- **Variable Name:** `RESEND_API_KEY` (must match exactly - this is what the code looks for)
- **Variable Value:** The actual API key string from Resend (e.g., `re_abc123xyz...`)

## Testing After Adding Variables

1. **Submit a test contact form** on your live site
2. **Check if you receive the email** at the `CONTACT_EMAIL` address
3. **Check the deployment logs** if emails aren't working:
   - Look for errors in the Shopify Partner Dashboard
   - Check for "RESEND_API_KEY is not configured" errors

## Troubleshooting

### "Email service is not configured" Error

- ✅ Check that `RESEND_API_KEY` is set in the Shopify Partner Dashboard
- ✅ Verify the API key is correct (no extra spaces or quotes)
- ✅ Make sure you've saved the variable and redeployed

### "Failed to send email" Error

- ✅ Check your Resend API key is valid
- ✅ Verify your Resend account has credits/quota
- ✅ Check Resend dashboard for any errors or rate limits
- ✅ Verify the "from" email address is valid (currently using `onboarding@resend.dev` for testing)

### Variables Not Appearing

- ✅ Make sure you're editing the correct deployment
- ✅ Check that you have the right permissions in Shopify Partner Dashboard
- ✅ Try removing and re-adding the variable
- ✅ Trigger a new deployment after adding variables

## Local Development

For local development, add these to your `.env` file in the project root:

```bash
RESEND_API_KEY=your_resend_api_key_here
CONTACT_EMAIL=info@freshstartairpurifiers.com
```

**Note:** The `.env` file is only for local development. It does NOT get deployed to production. You must set environment variables in the Shopify Partner Dashboard for production.

## Need Help?

- Check the [Shopify Oxygen Documentation](https://shopify.dev/docs/custom-storefronts/oxygen)
- Review the full [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md)
- Check Resend documentation: https://resend.com/docs

