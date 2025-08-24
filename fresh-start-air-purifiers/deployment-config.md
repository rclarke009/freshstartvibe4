# Deployment Configuration for Fresh Start Air Purifiers

## Environment Variables Required

Create a `.env` file in your project root with these variables:

```bash
# Shopify Store Configuration
PUBLIC_STORE_DOMAIN=rfbur0-m1.myshopify.com
PUBLIC_STOREFRONT_API_TOKEN=your_storefront_api_token_here
PUBLIC_STOREFRONT_ID=your_storefront_id_here

# Checkout Configuration
PUBLIC_CHECKOUT_DOMAIN=rfbur0-m1.myshopify.com

# Session Security
SESSION_SECRET=your_session_secret_here

# Sanity CMS (if needed for production)
SANITY_PROJECT_ID=your_sanity_project_id
SANITY_DATASET=production
SANITY_API_TOKEN=your_sanity_api_token

# Oxygen Deployment
OXYGEN_DEPLOYMENT_TOKEN=your_oxygen_deployment_token
```

## Steps to Get These Values

### 1. Storefront API Token
- Go to Shopify Admin → Settings → Apps and sales channels
- Click "Develop apps" → "Create an app"
- Name: "Fresh Start Air Purifiers Storefront"
- Admin API scopes: read_products, read_collections, read_cart, read_customers, read_orders
- Storefront API scopes: unauthenticated_read_product_listings, unauthenticated_read_product_inventory, unauthenticated_read_selling_plans, unauthenticated_read_discounts, unauthenticated_read_cart
- Install app and copy the Storefront API access token

### 2. Storefront ID
- In your Shopify admin, go to Settings → Sales channels → Online Store
- Look for "Storefront ID" or check the URL when viewing your storefront

### 3. Session Secret
- Generate a random string (32+ characters)
- You can use: `openssl rand -hex 32`

### 4. Oxygen Deployment Token
- This will be provided when you set up Oxygen deployment
