#!/bin/bash

# Queen Koba - Render Deployment Checklist
# This script prepares your app for Render deployment

set -e

echo "🚀 Queen Koba Render Deployment Checklist"
echo "=========================================="
echo ""

# Check git status
echo "✓ Checking git status..."
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Not a git repository. Initialize git first:"
    echo "   git init && git add . && git commit -m 'Initial commit'"
    exit 1
fi

# Check for required files
echo "✓ Checking required files..."
files=(
    "package.json"
    "vite.config.ts"
    "backend/koba--backend-only/requirements.txt"
    "backend/koba--backend-only/queenkoba_postgresql.py"
    "qwen-koba-admin/package.json"
)

for file in "${files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Missing file: $file"
        exit 1
    fi
done
echo "✅ All required files present"

# Build frontend
echo ""
echo "✓ Building frontend..."
npm run build:frontend
echo "✅ Frontend built successfully"

# Build admin
echo ""
echo "✓ Building admin panel..."
npm run build:admin
echo "✅ Admin panel built successfully"

# Check backend dependencies
echo ""
echo "✓ Checking backend dependencies..."
if ! pip list 2>/dev/null | grep -q flask; then
    echo "⚠️  Backend dependencies not installed locally (this is okay, Render will install them)"
fi

# Summary
echo ""
echo "=========================================="
echo "✅ DEPLOYMENT CHECKLIST COMPLETE!"
echo "=========================================="
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Push to GitHub:"
echo "   git add ."
echo "   git commit -m 'Prepare for Render deployment'"
echo "   git push origin main"
echo ""
echo "2. Create PostgreSQL Database on Render:"
echo "   - Go to https://dashboard.render.com/"
echo "   - Create New PostgreSQL database"
echo "   - Save the connection string"
echo ""
echo "3. Deploy Backend Web Service:"
echo "   - Root Directory: backend/koba--backend-only"
echo "   - Build Command: pip install -r app/requirements.txt"
echo "   - Start Command: gunicorn queenkoba_postgresql:app"
echo ""
echo "4. Deploy Frontend as Static Site:"
echo "   - Build Command: npm install && npm run build:frontend"
echo "   - Publish Directory: dist"
echo ""
echo "5. Deploy Admin as Static Site:"
echo "   - Build Command: npm install && npm run install:admin && npm run build:admin"
echo "   - Publish Directory: qwen-koba-admin/dist"
echo ""
echo "📖 For detailed instructions, see: RENDER_DEPLOYMENT_GUIDE.md"
echo ""
