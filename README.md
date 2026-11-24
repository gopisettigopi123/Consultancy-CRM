# Consultancy-CRM

A full-stack **Recruitment & Staffing Consultancy CRM** built with the **MERN** stack (MongoDB, Express.js, React, Node.js). It streamlines the end-to-end candidate lifecycle—from onboarding and resume management through technical training, mock interviews, marketing, vendor management, client submissions, and candidate payment tracking—with Role-Based Access Control (RBAC).

---

## Features

- **Dashboard & Analytics**: Real-time pipeline metrics, mock interview averages, technology breakdowns, submission status charts, and monthly trends powered by Recharts.
- **Candidate Management**: Create, update, search, and export candidates (CSV) with resume file uploads via Multer.
- **Training & Mock Interviews**: Track training batches, session dates, call-training progression, and scored Technical/Final mock interviews (`Pass` / `Fail`).
- **Marketing & Vendor Network**: Manage candidate marketing profiles, daily vendor submission trackers, and vendor/client directories.
- **Submissions Pipeline**: Track candidate-to-vendor-to-client submissions across statuses (`Submitted`, `Interview Scheduled`, `Rejected`, `Selected`).
- **Finance & Payments**: Track candidate payment schedules (`Upcoming`, `Paid`, `Overdue`) and company-level finance views.
- **Role-Based Access Control (RBAC)**: Dynamic `User` → `Role` → `Permission` management with JWT authentication and admin management UI.
- **Password Recovery**: Email-based 10-minute OTP password reset via Nodemailer (Gmail SMTP).
- **Multi-Company & Theme Support**: Switch active company context (`BNS`, `CQ`, `TB`, `ALICE`) and toggle light/dark themes.

---

## Tech Stack

### Backend
- **Runtime & Framework**: Node.js, Express `^5.2.1`
- **Database**: MongoDB with Mongoose `^9.3.3`
- **Authentication & Security**: `jsonwebtoken` (`^9.0.3`), `bcryptjs` (`^3.0.3`)
- **File Uploads**: `multer` (`^2.1.1`)
- **Email**: `nodemailer` (`^8.0.5`)
- **Utilities**: `cors`, `dotenv`, `nodemon` (dev)

### Frontend
- **Framework & Build**: React `^19.2.4`, Vite `^8.0.3`
- **Routing**: `react-router-dom` (`^7.13.2`)
- **UI & Styling**: Bootstrap `^5.3.8`, `react-bootstrap` (`^2.10.10`), `react-icons` (`^5.6.0`)
- **Data & Charts**: `axios` (`^1.14.0`), `recharts` (`^3.8.1`), `jwt-decode` (`^4.0.0`), `moment` (`^2.30.1`)

---

## Project Structure

```text
Consultancy-CRM/
├── backend/
│   ├── config/
│   │   └── db.js                      # MongoDB connection
│   ├── controllers/                   # Route handlers & business logic
│   ├── middlewares/
│   │   └── authMiddleware.js          # JWT protect & role authorize middleware
│   ├── models/                        # Mongoose schemas (User, Role, Permission, Candidate, etc.)
│   ├── routes/                        # Express API routers
│   ├── scripts/
│   │   ├── initUserManagement.js      # Seeds permissions, roles & migrates legacy users
│   │   └── recreateAdmin.js           # Restores/creates default Admin user
│   ├── uploads/                       # Uploaded candidate resumes
│   ├── utils/
│   │   └── emailService.js            # Nodemailer OTP email sender
│   ├── index.js                       # Express app entry point
│   └── package.json
└── frontend/
    ├── public/                        # Static assets & logos
    ├── src/
    │   ├── components/                # Layout, ProtectedRoute, reusable UI components
    │   ├── context/                   # AuthContext, CompanyContext, ThemeContext
    │   ├── modules/UserManagement/    # User & Permission management pages
    │   ├── pages/                     # Application pages (Dashboard, Candidates, Training, etc.)
    │   ├── services/
    │   │   └── api.js                 # Axios client & API helpers
    │   ├── App.jsx                    # Client-side routes
    │   └── main.jsx
    ├── vercel.json                    # Vercel SPA rewrite configuration
    ├── vite.config.js                 # Vite dev server (port 3000) & /api proxy
    └── package.json
```

---

## Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm**
- **MongoDB** (local instance or MongoDB Atlas cluster)

---

## Environment Variables

### Backend (`backend/.env`)

Create a `.env` file inside `backend/`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/consultancy_crm
JWT_SECRET=your_super_secret_jwt_key
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASS=your_gmail_app_password
```

| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | Port the Express server listens on | `5000` |
| `MONGO_URI` | MongoDB connection string | Required |
| `JWT_SECRET` | Secret key for signing/verifying JWTs | Required |
| `EMAIL_USER` | Gmail address for sending password reset OTPs | Required for OTP |
| `EMAIL_PASS` | Gmail App Password for Nodemailer | Required for OTP |

### Frontend (`frontend/.env`) *(Optional)*

```env
VITE_API_URL=http://localhost:5000/api
```

If omitted, the frontend defaults to `http://localhost:5000/api` (and Vite proxies `/api` to `http://localhost:5000` in development).

---

## Getting Started

### 1. Clone the repository
```bash
git clone <repository-url>
cd Consultancy-CRM
```

### 2. Setup the Backend
```bash
cd backend
npm install
```

Initialize default permissions and roles:
```bash
node scripts/initUserManagement.js
```

*(Optional)* Create or restore the default Admin account (`admin@crm.com` / `password123` — change immediately after login):
```bash
node scripts/recreateAdmin.js
```

Start the backend server:
```bash
npm run dev
```
The API server starts on `http://localhost:5000` (and displays your local network IP for LAN access).

### 3. Setup the Frontend
Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```
The React app runs at `http://localhost:3000`.

---

## Available Scripts

### Backend (`backend/`)
- `npm run dev` — Start the server with `nodemon` (auto-reload)
- `npm start` — Start the server with `node index.js`
- `node scripts/initUserManagement.js` — Seed default permissions & roles and migrate legacy string roles
- `node scripts/recreateAdmin.js` — Create or restore the default Admin user

### Frontend (`frontend/`)
- `npm run dev` — Start Vite development server on port `3000`
- `npm run build` — Build production bundle to `frontend/dist`
- `npm run preview` — Preview the production build locally
- `npm run lint` — Run ESLint across `.js` and `.jsx` files

---

## Roles & Permissions

Seeded by `backend/scripts/initUserManagement.js`:

| Role | Access Scope |
| :--- | :--- |
| **Admin** | Full system access (all 17 permissions, including User & Role management) |
| **Admin Team** | Full administrative access |
| **HR Team** | Dashboard, Candidates (view), and HR modules |
| **Training Team** | Dashboard, Training, and Mock Interviews |
| **Marketing Team** | Dashboard, Candidates, Vendors, Marketing, and Submissions |

---

## API Overview

| Base Route | Description |
| :--- | :--- |
| `/api/auth` | Login, register, profile (`/me`, `/profile`), logout, forgot/reset password |
| `/api/candidates` | Candidate CRUD, resume upload, CSV export (`/export`) |
| `/api/training` | Training batch records & candidate training lookup |
| `/api/mocks` | Mock interview records & scores |
| `/api/marketing` | Marketing profiles & daily submission trackers |
| `/api/vendors` | Vendor directory CRUD |
| `/api/submissions` | Client submission tracking & status updates |
| `/api/dashboard` | Aggregated CRM & pipeline statistics (`/stats`) |
| `/api/user-management` | Admin-only CRUD for users, roles, and permissions |
| `/api/payments` | Candidate payment records CRUD |

---

## Deployment

- **Frontend (Vercel)**: `frontend/vercel.json` is pre-configured with SPA rewrites (`/(.*) -> /index.html`). Set `VITE_API_URL` in your Vercel environment variables to point to your deployed backend URL.
- **Backend**: Deploy to any Node.js host (Render, Railway, EC2, etc.), configure the environment variables listed above, and ensure persistent storage if storing uploaded resumes locally in `backend/uploads/`.
