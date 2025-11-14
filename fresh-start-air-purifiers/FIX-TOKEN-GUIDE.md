# Fix 401 Storefront API Error

## Problem
Your `.env` file contains an **Admin API token** (`shpat_...`) but you need a **Storefront API token** (`shpca_...` or `shpcs_...`).

## Quick Fix Steps

### Step 1: Generate Storefront API Token

1. **Go to Shopify Admin**
   - Navigate to: https://rfbur0-m1.myshopify.com/admin
   - Login with your admin credentials

2. **Create or Edit App**
   - Go to **Settings** → **Apps and sales channels**
   - Click **Develop apps**
   - If you already have an app, click on it
   - If not, click **Create an app** and name it: `Fresh Start Air Purifiers Storefront`

3. **Configure Storefront API Access**
   - In your app settings, find **Storefront API access**
   - Enable it if not already enabled
   - Configure the scopes:
     - ✅ `unauthenticated_read_product_listings`
     - ✅ `unauthenticated_read_product_inventory`
     - ✅ `unauthenticated_read_selling_plans`
     - ✅ `unauthenticated_read_discounts`
     - ✅ `unauthenticated_read_cart`

4. **Install App and Get Token**
   - Click **Install app** (if not already installed)
   - After installation, you'll see **Storefront API access token**
   - Click **Reveal token** or **View token**
   - **Copy the token** - it should start with `shpca_` (public) or `shpcs_` (private)
   - ⚠️ **IMPORTANT**: Save this token immediately - you won't be able to see it again!

### Step 2: Get Storefront ID

1. In Shopify Admin, go to **Settings** → **Sales channels** → **Online Store**
2. Look for **Storefront ID** or check the URL when viewing your storefront
3. The Storefront ID is usually found in the URL or in the store settings
4. **Alternative**: The Storefront ID might be visible in your storefront URL or in the app settings

### Step 3: Update .env File

Open your `.env` file and update it with:

```bash
# Session Security
SESSION_SECRET="be578fce78f088c1b44e11457ee5d1b81c78863f"

# Shopify Storefront API Configuration
# IMPORTANT: Use a STOREFRONT API token (starts with shpca_ or shpcs_), NOT an Admin API token (shpat_)
PUBLIC_STOREFRONT_API_TOKEN="shpca_YOUR_NEW_TOKEN_HERE"
PUBLIC_STORE_DOMAIN="rfbur0-m1.myshopify.com"
PUBLIC_STOREFRONT_ID="YOUR_STOREFRONT_ID_HERE"
```

Replace:
- `shpca_YOUR_NEW_TOKEN_HERE` with your Storefront API token (starts with `shpca_` or `shpcs_`)
- `YOUR_STOREFRONT_ID_HERE` with your Storefront ID

### Step 4: Restart Development Server

After updating the `.env` file:

1. Stop the current dev server (Ctrl+C)
2. Start it again: `npm run dev`
3. The 401 errors should be resolved

## Alternative: Use Shopify CLI to Link Storefront

If you have the Shopify CLI configured, you can automatically pull environment variables:

```bash
cd fresh-start-air-purifiers
shopify hydrogen link
```

Or pull environment variables:

```bash
shopify hydrogen env pull
```

This will automatically populate your `.env` file with the correct tokens from your Shopify store.

## Verification

After updating your `.env` file, verify:
- ✅ Token starts with `shpca_` or `shpcs_` (NOT `shpat_`)
- ✅ `PUBLIC_STOREFRONT_ID` is set
- ✅ `PUBLIC_STORE_DOMAIN` is set to `rfbur0-m1.myshopify.com`
- ✅ No more 401 errors in the terminal

## Troubleshooting

### Still getting 401 errors?
- Verify the token is correct (no extra spaces or quotes)
- Check that the app is installed and has the correct scopes
- Ensure the Storefront ID is correct
- Try regenerating the token

### Token not working?
- Make sure you're using the **Storefront API token**, not the Admin API token
- Verify the app has the required scopes enabled
- Check that the app is installed on your store

### Need help finding Storefront ID?
- Check Settings → Sales channels → Online Store
- Look in the Shopify Partner Dashboard for your storefront
- Check the URL when viewing your storefront in the admin

## Difference Between Token Types

- **Admin API Token** (`shpat_...`): Used for admin operations, NOT for storefront
- **Storefront API Token - Public** (`shpca_...`): Used for public storefront access
- **Storefront API Token - Private** (`shpcs_...`): Used for server-side storefront access (recommended for production)

For local development, either public or private Storefront API tokens will work.


