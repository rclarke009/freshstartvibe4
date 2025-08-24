#!/bin/bash

# Fresh Start Air Purifiers - Deployment Script
echo "🚀 Starting deployment process..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create .env file with required environment variables"
    echo "See deployment-config.md for details"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run type check
echo "🔍 Running type check..."
npm run typecheck

# Run linting
echo "🧹 Running linting..."
npm run lint

# Build the application
echo "🏗️ Building application..."
npm run build

# Deploy to Oxygen
echo "🚀 Deploying to Shopify Oxygen..."
shopify hydrogen deploy

echo "✅ Deployment complete!"
echo "🌐 Your store should be available at: https://www.freshstartairpurifiers.com"
