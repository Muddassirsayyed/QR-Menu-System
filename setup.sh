#!/bin/bash
# setup.sh — Run this once after cloning

set -e

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🍽️  MenuQR Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "📦 Installing dependencies..."
npm install

echo ""
echo "🔧 Generating Prisma client..."
npx prisma generate

echo ""
echo "🗃️  Creating database schema..."
npx prisma db push

echo ""
echo "🌱 Seeding sample data..."
npx tsx prisma/seed.ts

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅ Setup complete!"
echo ""
echo "  📧 Admin:     admin@menuqr.com"
echo "  🔑 Password:  admin123"
echo "  🍽️  Menu:      /menu/spice-garden"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  Run:  npm run dev"
echo "  Open: http://localhost:3000"
echo ""
