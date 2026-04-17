# BP Creation — Full-Stack CRUD Application

> **Stack:** Angular 18 (Standalone) · Node.js + Express · MySQL

---

## 📁 Complete Folder Structure

```
bp-creation/
│
├── backend/                        ← Node.js + Express API
│   ├── config/
│   │   ├── db.js                   ← MySQL connection pool
│   │   └── initDb.js               ← One-time DB + table setup script
│   ├── controllers/
│   │   └── bpController.js         ← All CRUD logic (getAll, getById, create, update, remove)
│   ├── middleware/
│   │   └── errorHandler.js         ← Global Express error handler
│   ├── routes/
│   │   └── bpRoutes.js             ← Route definitions → maps URL to controller
│   ├── .env                        ← DB credentials (never commit this)
│   ├── package.json
│   └── server.js                   ← Express app entry point
│
└── frontend/                       ← Angular 18 standalone app
    └── src/
        ├── app/
        │   ├── components/
        │   │   ├── dashboard/
        │   │   │   ├── dashboard.component.ts      ← List all BPs, search, delete
        │   │   │   ├── dashboard.component.html    ← Table UI template
        │   │   │   └── dashboard.component.css     ← Dashboard styles
        │   │   └── bp-form/
        │   │       ├── bp-form.component.ts        ← Create + Edit form logic
        │   │       ├── bp-form.component.html      ← Form template
        │   │       └── bp-form.component.css       ← Form styles
        │   ├── models/
        │   │   └── business-partner.model.ts       ← TypeScript interfaces
        │   ├── services/
        │   │   └── bp.service.ts                   ← All HttpClient API calls
        │   ├── app.component.ts                    ← Root component (router-outlet)
        │   ├── app.config.ts                       ← provideRouter + provideHttpClient
        │   └── app.routes.ts                       ← Route definitions
        ├── styles.css                              ← Global styles
        ├── index.html
        └── main.ts                                 ← Bootstrap entry point
```

---

## 🗄️ MySQL Table Schema

```sql
CREATE TABLE business_partners (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  bp_code        VARCHAR(20)  NOT NULL UNIQUE,       -- Auto-generated: ASN001, ASN002...
  bp_name        VARCHAR(100) NOT NULL,
  email          VARCHAR(150) NOT NULL UNIQUE,
  mobile_no      VARCHAR(20)  NOT NULL,
  status         ENUM('Approved','Rejected','Pending') DEFAULT 'Pending',
  customer_group VARCHAR(50),
  contact_person VARCHAR(100),
  gst_no         VARCHAR(20),
  city           VARCHAR(60),
  state          VARCHAR(60),
  country        VARCHAR(60),
  postal_code    VARCHAR(10),
  address        VARCHAR(255),
  ship_city      VARCHAR(60),
  ship_state     VARCHAR(60),
  ship_country   VARCHAR(60),
  ship_postal    VARCHAR(10),
  ship_address   VARCHAR(255),
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 🔗 REST API Reference

| Method | Endpoint          | Description                  | Body / Query Params                     |
|--------|-------------------|------------------------------|-----------------------------------------|
| GET    | `/api/bp`         | Get all partners             | `?search=name&status=Approved`          |
| GET    | `/api/bp/:id`     | Get single partner by ID     | —                                       |
| POST   | `/api/bp`         | Create new partner           | `{ bp_name, email, mobile_no, status }` |
| PUT    | `/api/bp/:id`     | Update existing partner      | Same as POST body                       |
| DELETE | `/api/bp/:id`     | Delete partner               | —                                       |
| GET    | `/health`         | Server health check          | —                                       |

### Example API Response
```json
{
  "success": true,
  "message": "Business partner created successfully",
  "data": {
    "id": 4,
    "bp_code": "ASN004",
    "bp_name": "John Doe",
    "email": "john@example.com",
    "mobile_no": "+91 98765 00001",
    "status": "Pending",
    "created_at": "2026-04-16T10:30:00.000Z"
  }
}
```

---

## ⚙️ Step-by-Step Setup

### Prerequisites
- Node.js v18+ → https://nodejs.org
- MySQL 8.0+ → https://dev.mysql.com/downloads/
- Angular CLI v18 → `npm install -g @angular/cli@18`

---

### Step 1 — Clone / Place Project Files

Place the `bp-creation/` folder anywhere on your machine.

---

### Step 2 — Setup Backend

```bash
# 1. Go to backend folder
cd bp-creation/backend

# 2. Install dependencies
npm install

# 3. Configure environment
# Open .env and set your MySQL credentials:
#   DB_HOST=localhost
#   DB_USER=root
#   DB_PASSWORD=your_mysql_password
#   DB_NAME=bp_creation_db
#   PORT=3000

# 4. Initialize database (run ONCE)
node config/initDb.js
# ✅ This creates the database, table, and seeds 3 sample records

# 5. Start the server
npm run dev
# 🚀 API running at http://localhost:3000
```

---

### Step 3 — Setup Frontend

```bash
# Open a NEW terminal tab

# 1. Go to frontend folder
cd bp-creation/frontend

# 2. Install dependencies
npm install

# 3. Start Angular dev server
ng serve
# 🚀 App running at http://localhost:4200
```

---

### Step 4 — Open the App

Visit: **http://localhost:4200**

You should see the BP Creation dashboard with 3 pre-seeded records.

---

## 🔄 Data Flow Explained

```
UI Action (click "Save")
       │
       ▼
BpFormComponent.onSubmit()       ← Validates ReactiveForm
       │
       ▼
BpService.create(payload)        ← Calls HttpClient.post()
       │
       ▼  HTTP POST /api/bp
Express Router (bpRoutes.js)     ← Matches route
       │
       ▼
bpController.create()            ← Business logic + validation
       │
       ▼
MySQL Pool (db.js)               ← Executes INSERT query
       │
       ▼  DB returns insertId
Controller builds response       ← { success, message, data }
       │
       ▼  JSON response
BpService receives Observable    ← Angular processes response
       │
       ▼
Component shows success/error    ← Navigates to dashboard
```

---

## 📋 File-by-File Explanation

### Backend

| File | Purpose |
|------|---------|
| `server.js` | Express app setup: CORS, JSON parsing, mounts `/api/bp` routes, starts HTTP server |
| `config/db.js` | Creates a MySQL connection pool (10 connections). Pool is shared across all requests |
| `config/initDb.js` | One-time setup: creates DB, table schema, seeds sample data |
| `routes/bpRoutes.js` | Maps `GET /` → getAll, `POST /` → create, `GET /:id` → getById, etc. |
| `controllers/bpController.js` | All CRUD logic. Each function: validates input → queries DB → returns JSON |
| `middleware/errorHandler.js` | Catches any unhandled errors and returns standardised error JSON |
| `.env` | Environment variables: DB host, user, password, port |

### Frontend

| File | Purpose |
|------|---------|
| `main.ts` | Bootstraps the Angular app using standalone API |
| `app.config.ts` | Provides Router + HttpClient to the whole app |
| `app.routes.ts` | Lazy-loads Dashboard and BpForm components |
| `app.component.ts` | Root shell — just renders `<router-outlet>` |
| `models/business-partner.model.ts` | TypeScript interfaces for type safety |
| `services/bp.service.ts` | All API calls. Returns Observables that components subscribe to |
| `dashboard.component.ts` | Loads all partners, handles search/filter, delete, pagination |
| `dashboard.component.html` | Table UI with status badges, avatar initials, action buttons |
| `bp-form.component.ts` | Detects edit vs create mode via `:id` route param. Builds ReactiveForm with validators |
| `bp-form.component.html` | Form UI with fields for all BP sections (core, bill-to, ship-to) |
| `styles.css` | Global reset + DM Sans font |

---

## 🚦 How Frontend Connects to Backend

1. **CORS** — `server.js` allows requests from `http://localhost:4200`
2. **Base URL** — `bp.service.ts` sets `baseUrl = 'http://localhost:3000/api/bp'`
3. **HttpClient** — Angular's built-in HTTP client sends requests and returns Observables
4. **Components** — Subscribe to Observables, handle `next` (success) and `error` callbacks

---

## ✅ Features Implemented

- [x] **Full CRUD** — Create, Read (all + by ID), Update, Delete
- [x] **Search** — By name, email, or BP code (backend SQL LIKE query)
- [x] **Status filter** — Filter by Approved / Rejected / Pending
- [x] **Form validation** — Required fields, email format, phone pattern
- [x] **Edit mode** — Pre-fills form from API, PUT request on save
- [x] **Loading states** — Spinner on table load, spinner on delete, loading bar on form
- [x] **Success/error alerts** — Auto-dismissing messages after actions
- [x] **Pagination** — Client-side pagination with page numbers
- [x] **Avatar initials** — Color-coded avatars generated from names
- [x] **Status badges** — Color-coded Approved / Rejected / Pending
- [x] **Auto BP Code** — Generated server-side (ASN001, ASN002...)
- [x] **Delete confirmation** — Browser confirm dialog before delete
- [x] **Responsive layout** — Clean admin dashboard UI
- [x] **Error handling** — Duplicate email (409), not found (404), server errors (500)

---

## 🐛 Troubleshooting

| Problem | Fix |
|---------|-----|
| `MySQL connection failed` | Check `.env` credentials, ensure MySQL service is running |
| `CORS error` in browser | Ensure backend runs on port 3000, frontend on 4200 |
| `ng: command not found` | Run `npm install -g @angular/cli@18` |
| `Cannot GET /api/bp` | Run `npm run dev` in backend folder first |
| `Table doesn't exist` | Run `node config/initDb.js` in backend folder |
| Port 3000 already in use | Change `PORT=3001` in `.env` and update `bp.service.ts` baseUrl |
