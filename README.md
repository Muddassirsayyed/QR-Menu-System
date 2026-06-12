# 🍽️ MenuQR — QR Code Restaurant Menu System

A full-stack production-grade digital menu platform. Restaurant owners place QR codes on tables; customers scan to view menus instantly. Every scan is tracked in the developer dashboard.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Generate Prisma client + push schema + seed database
npm run setup

# 3. Start the dev server
npm run dev
```

Then open: **http://localhost:3000**

---

## 🔑 Demo Credentials

| Role  | Email                | Password  |
|-------|----------------------|-----------|
| Admin | admin@menuqr.com     | admin123  |

---

## 🌐 Key URLs

| Page              | URL                           |
|-------------------|-------------------------------|
| Dashboard         | http://localhost:3000/dashboard |
| Login             | http://localhost:3000/login     |
| Demo Menu         | http://localhost:3000/menu/spice-garden |
| Analytics         | http://localhost:3000/dashboard/analytics |
| Scan Logs         | http://localhost:3000/dashboard/scans |

---

## 📁 Project Structure

```
qr-menu-system/
├── app/
│   ├── api/
│   │   ├── auth/          # Login, logout, session
│   │   ├── dashboard/     # Analytics stats
│   │   ├── menu/          # Menu CRUD + public API
│   │   ├── restaurants/   # Restaurant + QR + categories
│   │   └── scan/          # Scan tracking + logs
│   ├── dashboard/
│   │   ├── page.tsx       # Overview + charts
│   │   ├── analytics/     # Deep analytics
│   │   ├── restaurants/   # Manage restaurants
│   │   │   └── [id]/menu/ # Manage menu items
│   │   └── scans/         # Scan log table
│   ├── login/             # Auth page
│   ├── menu/[slug]/       # Public customer menu
│   ├── globals.css
│   └── layout.tsx
├── components/
│   └── dashboard/
│       ├── Sidebar.tsx
│       └── Header.tsx
├── lib/
│   ├── auth.ts            # JWT utilities
│   ├── prisma.ts          # DB client
│   ├── qrcode.ts          # QR generation
│   ├── scan-tracker.ts    # UA parsing
│   └── utils.ts           # Helpers
├── prisma/
│   ├── schema.prisma      # Database models
│   └── seed.ts            # Sample data (100 items)
├── middleware.ts           # Auth protection
└── .env                   # Environment variables
```

---

## 🗃️ Database Schema

- **User** — Admin accounts with JWT auth
- **Restaurant** — Restaurant profiles with slug-based routing
- **Category** — Menu categories (Starters, Mains, Biryani, etc.)
- **MenuItem** — Food items with veg/non-veg badges, images, prices
- **QRCode** — Generated QR per restaurant with scan count
- **ScanLog** — Every scan: device, browser, OS, IP, location, visitor ID

---

## ✨ Features

### Customer Menu (Public)
- No login required — scan QR → view menu instantly
- Search bar across all items
- Category filters with item counts
- Veg-only filter
- Chef's Pick featured items
- Mobile-first responsive design
- Scan tracked silently on page load

### Admin Dashboard
- **Overview**: Live stats — total scans, daily/weekly/monthly
- **Analytics**: 30-day trend chart, device/browser/country breakdown
- **Restaurants**: Create, edit, delete, view QR code, manage menu
- **Scan Logs**: Paginated table with search and device filter

### QR System
- Auto-generated QR on restaurant creation
- Downloadable as PNG
- Each scan logs: time, device, browser, OS, IP, location, visitor ID

---

## 🛠️ Tech Stack

| Layer     | Tech                        |
|-----------|-----------------------------|
| Framework | Next.js 15 (App Router)     |
| Language  | TypeScript                  |
| Styling   | Tailwind CSS                |
| Database  | SQLite (via Prisma ORM)     |
| Auth      | JWT (jose) + bcryptjs       |
| Charts    | Recharts                    |
| QR Code   | qrcode                      |
| UA Parse  | ua-parser-js                |

---

## 🔐 Security

- JWT tokens in httpOnly cookies
- Bcrypt password hashing (10 rounds)
- Zod input validation on all API routes
- Middleware-level route protection
- Auth check on every protected API route

---

## 📝 Individual Commands

```bash
npm run db:generate   # Generate Prisma client
npm run db:push       # Push schema to SQLite
npm run db:seed       # Seed with 100 food items + sample scans
npm run db:studio     # Open Prisma Studio (DB browser)
npm run dev           # Start dev server
npm run build         # Production build
npm run start         # Start production server
```
