# 🚀 Complete Deployment Guide for Fresh Start Air Purifiers

## Prerequisites ✅

- [x] Shopify store: `rfbur0-m1.myshopify.com`
- [x] Custom domain: `www.freshstartairpurifiers.com`
- [x] Hydrogen storefront built and tested locally
- [x] Sanity CMS configured and working

## Step 1: Generate Storefront API Token 🔑

1. **Go to Shopify Admin**
   - Navigate to: `https://rfbur0-m1.myshopify.com/admin`
   - Login with your admin credentials

2. **Create App**
   - Go to **Settings** → **Apps and sales channels**
   - Click **Develop apps** (or **Manage private apps**)
   - Click **Create an app**
   - Name: `Fresh Start Air Purifiers Storefront`

3. **Configure API Scopes**
   - **Admin API access scopes:**
     - `read_products`
     - `read_collections` 
     - `read_cart`
     - `read_customers`
     - `read_orders`
   
   - **Storefront API access scopes:**
     - `unauthenticated_read_product_listings`
     - `unauthenticated_read_product_inventory`
     - `unauthenticated_read_selling_plans`
     - `unauthenticated_read_discounts`
     - `unauthenticated_read_cart`

4. **Install App**
   - Click **Install app**
   - Copy the **Storefront API access token** (keep this safe!)

## Step 2: Get Storefront ID 🆔

1. In Shopify admin, go to **Settings** → **Sales channels** → **Online Store**
2. Look for "Storefront ID" or check the URL when viewing your storefront
3. Note this ID down

## Step 3: Generate Session Secret 🔐

Run this command in your terminal:
```bash
openssl rand -hex 32
```
Copy the generated string - this will be your `SESSION_SECRET`

## Step 4: Create Environment File 📝

1. In your project root, create a `.env` file
2. Add the following content:

```bash
# Shopify Store Configuration
PUBLIC_STORE_DOMAIN=rfbur0-m1.myshopify.com
PUBLIC_STOREFRONT_API_TOKEN=YOUR_ACTUAL_TOKEN_HERE
PUBLIC_STOREFRONT_ID=YOUR_STOREFRONT_ID_HERE

# Checkout Configuration
PUBLIC_CHECKOUT_DOMAIN=rfbur0-m1.myshopify.com

# Session Security
SESSION_SECRET=YOUR_GENERATED_SESSION_SECRET_HERE

# Sanity CMS (if needed for production)
SANITY_PROJECT_ID=your_sanity_project_id
SANITY_DATASET=production
SANITY_API_TOKEN=your_sanity_api_token
```

**⚠️ IMPORTANT:** Replace the placeholder values with your actual tokens and IDs!

## Step 5: Test Locally 🧪

Before deploying, test your build:

```bash
# Install dependencies
npm install

# Run type check
npm run typecheck

# Run linting
npm run lint

# Build the application
npm run build

# Test preview
npm run preview
```

## Step 6: Configure Environment Variables in Shopify Oxygen 🔐

**IMPORTANT:** Environment variables must be set in the Shopify Partner Dashboard, not just in your local `.env` file.

### Method 1: Using Shopify Partner Dashboard (Recommended)

1. **Go to Shopify Partner Dashboard**
   - Navigate to: https://partners.shopify.com
   - Login with your Shopify Partner account

2. **Select Your Store**
   - Go to **Stores** → Select your store
   - Or go directly to: https://partners.shopify.com/[your-partner-id]/stores

3. **Navigate to Oxygen Deployment**
   - Click on **Apps** or **Deployments** in the left sidebar
   - Find your Hydrogen/Oxygen deployment
   - Click on the deployment name

4. **Add Environment Variables**
   - Look for **Environment Variables** or **Settings** section
   - Click **Add Environment Variable** or **Manage Variables**
   - Add the following variables:
     - **Variable Name:** `RESEND_API_KEY` (use this exact name - must match what the code expects)
     - **Variable Value:** Your actual Resend API key string (the long string like `re_abc123...` from Resend)
     - **Variable Name:** `CONTACT_EMAIL` (optional)
     - **Variable Value:** `contact@freshstartairpurifiers.com` (or leave default)
   - **Important:** 
     - The variable NAME is `RESEND_API_KEY`, NOT the display name from Resend
     - The Resend key name (e.g., "Fresh Start Contact Form") is just a label in Resend's dashboard
     - The variable VALUE is the actual API key string you copied from Resend
   - **Security Note:** When creating your Resend API key, select "Sending access" only, not "Full access"

5. **Save Changes**
   - Click **Save** or **Update**
   - The deployment will automatically redeploy with the new variables

### Method 2: Using Shopify CLI (Alternative)

If you have access to the Shopify CLI with deployment permissions:

```bash
# Set environment variable
shopify hydrogen env set RESEND_API_KEY=your_api_key_here

# Set multiple variables
shopify hydrogen env set RESEND_API_KEY=your_api_key_here CONTACT_EMAIL=contact@example.com
```

### Method 3: Using oxygen.json (If Supported)

Some Shopify Oxygen deployments support an `oxygen.json` file in your project root:

```json
{
  "version": 1,
  "compatibility_date": "2025-01-01",
  "vars": {
    "RESEND_API_KEY": "your_api_key_here",
    "CONTACT_EMAIL": "contact@freshstartairpurifiers.com"
  }
}
```

**Note:** This method may not be available in all Shopify Oxygen deployments. Check the Shopify Oxygen documentation for the latest method.

## Step 7: Deploy to Oxygen 🚀

### Option A: Quick Deploy
```bash
npm run deploy
```

### Option B: Full Deploy (Recommended)
```bash
npm run deploy:full
```

This will:
- ✅ Check for .env file
- ✅ Install dependencies
- ✅ Run type checking
- ✅ Run linting
- ✅ Build the application
- ✅ Deploy to Oxygen

**Note:** Your local `.env` file is used for local development only. Environment variables for production must be set in the Shopify Partner Dashboard.

## Step 8: Configure Domain 🌐

1. **In Shopify Admin:**
   - Go to **Settings** → **Domains**
   - Add your custom domain: `www.freshstartairpurifiers.com`
   - Set it as primary domain

2. **DNS Configuration:**
   - Point your domain to Shopify's servers
   - Wait for DNS propagation (can take up to 48 hours)

3. **SSL Certificate:**
   - Shopify will automatically provision SSL certificates
   - This may take a few hours

## Step 9: Post-Deployment Testing 🧪

1. **Test all pages:**
   - Homepage
   - Product pages
   - Collection pages
   - Cart functionality
   - Checkout process

2. **Test on different devices:**
   - Desktop
   - Mobile
   - Tablet

3. **Test Sanity CMS integration:**
   - Verify content updates appear on live site
   - Check image loading

## Troubleshooting 🔧

### Common Issues:

1. **"Environment variables not found"**
   - Check your `.env` file exists
   - Verify all required variables are set

2. **"Build failed"**
   - Run `npm run typecheck` to find TypeScript errors
   - Run `npm run lint` to find linting issues

3. **"Deployment failed"**
   - Check your Shopify Oxygen deployment token
   - Verify your storefront API token is correct

4. **"Domain not working"**
   - Check DNS settings
   - Wait for propagation (up to 48 hours)
   - Verify SSL certificate is provisioned

## Support 📞

If you encounter issues:
1. Check the Shopify Oxygen documentation
2. Review your environment variables
3. Check the deployment logs
4. Contact Shopify support if needed

## Success! 🎉

Once deployed successfully, your store will be available at:
**https://www.freshstartairpurifiers.com**

---

**Next Steps After Deployment:**
- Set up Google Analytics
- Configure email marketing
- Set up abandoned cart recovery
- Test payment processing
- Monitor performance metrics
