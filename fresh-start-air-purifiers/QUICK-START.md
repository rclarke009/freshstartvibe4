# 🚀 Quick Start Deployment Checklist

## Immediate Actions Required (Next 15 minutes)

### 1. 🔑 Generate Storefront API Token
- [ ] Go to: `https://rfbur0-m1.myshopify.com/admin`
- [ ] Settings → Apps and sales channels → Develop apps
- [ ] Create app: "Fresh Start Air Purifiers Storefront"
- [ ] Add required API scopes (see DEPLOYMENT-GUIDE.md)
- [ ] Install app and copy the token

### 2. 🆔 Get Storefront ID
- [ ] Go to Settings → Sales channels → Online Store
- [ ] Note the Storefront ID

### 3. 🔐 Generate Session Secret
- [ ] Run: `openssl rand -hex 32`
- [ ] Copy the generated string

### 4. 📝 Create .env File
- [ ] Create `.env` file in project root
- [ ] Add all environment variables (see deployment-config.md)
- [ ] Replace placeholder values with actual tokens

### 5. 🧪 Test Build
- [ ] Run: `npm run typecheck`
- [ ] Run: `npm run lint`
- [ ] Run: `npm run build`
- [ ] Run: `npm run preview`

### 6. 🚀 Deploy
- [ ] Run: `npm run deploy:full`
- [ ] Wait for deployment to complete

### 7. 🌐 Configure Domain
- [ ] In Shopify admin: Settings → Domains
- [ ] Add: `www.freshstartairpurifiers.com`
- [ ] Set as primary domain
- [ ] Configure DNS (point to Shopify)

## Expected Timeline
- **Setup**: 15-30 minutes
- **Deployment**: 5-10 minutes
- **DNS Propagation**: Up to 48 hours
- **SSL Certificate**: 2-4 hours

## Success Indicators
- ✅ Build completes without errors
- ✅ Deployment succeeds
- ✅ Domain resolves to your store
- ✅ SSL certificate is active
- ✅ All pages load correctly

## If You Get Stuck
1. Check the full `DEPLOYMENT-GUIDE.md`
2. Verify all environment variables are set
3. Check deployment logs for specific errors
4. Ensure your Shopify app has correct permissions

---

**Your store will be live at: https://www.freshstartairpurifiers.com**
