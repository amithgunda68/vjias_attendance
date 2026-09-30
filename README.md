# 🎓 Veritas University - College Attendance Portal

A modern, responsive, role-based **College Attendance Management Portal** engineered for higher education institutions. Built with React, TypeScript, Vite, Tailwind CSS, Lucide Icons, and Recharts.

Adheres strictly to the architectural specifications and design guidelines defined in [`SPEC_README.md`](./SPEC_README.md).

---

## 🌟 Key Features

### 👨‍🎓 Student Portal
- **Attendance Overview**: Real-time KPI summary (Overall percentage, Present vs. Absent, Total classes).
- **Subject-Wise Cards**: Visual progress indicators, attendance tiers (Excellent, Good, Warning, Critical), and status badges.
- **Attendance Calculator**: Interactive calculator implementing `(P + x) / (T + x) >= Target%` to compute exact classes required to achieve academic eligibility.
- **Attendance Trends**: Visual 6-week attendance timeline using responsive Recharts.
- **Schedule & Announcements**: Today's class timetable preview and official college notices.

### 👩‍🏫 Faculty Portal
- **Class Management**: View assigned courses, sections, and today's scheduled lectures.
- **Interactive Attendance Marking**: Fast roll-call interface with one-click **"Mark All Present"**, individual toggle controls, and real-time counter verification.
- **Low-Attendance Watchlist**: Immediate identification of students falling below the 75% threshold with quick alert dispatch.
- **Subject Analytics**: Visual subject attendance distribution chart.

### 🏛️ Administrator Portal
- **College-Level KPIs**: Institution-wide attendance metrics, total student/faculty counts, and threshold alerts.
- **Department Analytics**: Comparative attendance analytics across Computer Science, Electronics, Mechanical, and Civil departments.
- **Trend Analysis**: Monthly institution attendance progression.
- **Academic Controls**: Direct management shortcuts for students, faculty, subjects, and departmental settings.

---

## 🚀 How to Run the Project Locally

Follow these quick steps to get the application running on your local machine.

### Prerequisites

Ensure you have the following installed:
- **Node.js**: `v18.0.0` or higher (tested on Node v20/v22/v26)
- **npm**: `v9.0.0` or higher

Check your versions:
```bash
node -v
npm -v
```

---

### Step-by-Step Local Setup

#### 1. Navigate to the Project Directory
Open your terminal (PowerShell or Command Prompt on Windows, or Bash on macOS/Linux) and navigate to the project directory:
```bash
cd "c:/attendance portal"
```

#### 2. Install Dependencies
Install all required frontend dependencies:
```bash
cd frontend
npm install
```
*(On Windows PowerShell, if script execution policy restricts `npm`, use `npm.cmd install`)*

#### 3. Start the Development Server
Run the local Vite development server:
```bash
npm run dev
```
*(Or `npm.cmd run dev` on Windows)*

The application will start immediately. You will see output similar to:
```text
  VITE v6.x.x  ready in 250 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

#### 4. Open in Your Browser
Open your favorite web browser and navigate to:
```text
http://localhost:5173
```

---

## 🔑 Demo Login Credentials

For local testing and demonstration, pre-configured demo credentials are provided. You can log in manually using the credentials below, or click any of the **Quick Demo Login** buttons on the login page to sign in instantly with one click:

| Role | Email | Password | Quick Features |
| :--- | :--- | :--- | :--- |
| **Student** | `alex.johnson@college.edu` | `student123` | Attendance calculator, subject progress, alerts |
| **Faculty** | `sarah.mitchell@college.edu` | `faculty123` | Class schedule, interactive attendance marker, watchlist |
| **Administrator**| `admin@college.edu` | `admin123` | College-wide stats, department charts, management |

> **Role Switcher**: While logged in, you can also use the **Demo Role Switcher** dropdown located in the top navigation bar to switch between Student, Faculty, and Admin roles without logging out.

---

## 📁 Project Structure

```text
attendance-portal/
├── README.md                      # Local setup guide & documentation
├── SPEC_README.md                 # Primary specification & single source of truth
├── package.json                   # Root workspace orchestration
├── .gitignore                     # Git ignore definitions
├── .env.example                   # Environment configuration template
│
└── frontend/
    ├── index.html                 # HTML entry point with modern Inter font
    ├── vite.config.ts             # Vite build configuration
    ├── tailwind.config.js         # Tailwind CSS styling configuration
    ├── postcss.config.js          # PostCSS configuration
    ├── tsconfig.json              # TypeScript compilation settings
    └── src/
        ├── types/                 # TypeScript interfaces (User, Student, Subject, Attendance)
        ├── utils/                 # Attendance calculation logic & formulas
        ├── services/              # Realistic mock dataset & API service simulation
        ├── context/               # AuthContext & role-based authentication
        ├── components/
        │   ├── common/            # Reusable UI (StatCard, Badge, Button, Modal, ProgressBar)
        │   └── layout/            # DashboardLayout, Sidebar, Navbar, MobileNav
        ├── pages/
        │   ├── Login.tsx          # Login screen with validation & demo buttons
        │   ├── StudentDashboard.tsx # Student metrics, calculator & charts
        │   ├── FacultyDashboard.tsx # Faculty view & attendance marking dialog
        │   └── AdminDashboard.tsx   # Institutional analytics & controls
        ├── App.tsx                # Client-side routing & protected routes
        └── main.tsx               # React application mounting
```

---

## 📊 Attendance Calculation Formula

The calculator implements the exact formula specified in Section 42 of `SPEC_README.md`:

$$\text{Attendance \%} = \left(\frac{\text{Present Classes}}{\text{Total Classes}}\right) \times 100$$

To find consecutive future classes $x$ needed to reach a target percentage $R$:

$$\frac{P + x}{T + x} \ge R \implies x \ge \left\lceil\frac{R \cdot T - P}{1 - R}\right\rceil$$

Edge cases handled:
- Total classes is $0$.
- Target percentage is already achieved.
- Target percentage is mathematically unreachable within semester constraints.

---

## 🛠️ Technology Stack

- **Frontend Library**: React 18 / 19 with TypeScript
- **Styling**: Tailwind CSS with custom academic palette
- **Icons**: Lucide React
- **Charts**: Recharts
- **Routing**: React Router DOM (v7)
- **Build Tool**: Vite

---

## 📜 Development Roadmap (Phases)

- ✅ **Phase 1: Project Setup & Design System** (Completed)
- ✅ **Phase 2: UI & Role Dashboards** (Completed: Student, Faculty, Admin, Marking Interface)
- ⏳ **Phase 3: Extended Student Features** (Full calendar, complete history log)
- ⏳ **Phase 4: Extended Faculty Features** (Historical attendance edit audit log, CSV export)
- ⏳ **Phase 5: Extended Admin Management** (CRUD dialogs for students, faculty, departments)
- ⏳ **Phase 6: Backend API & PostgreSQL Database** (Node.js, Express, Prisma/Drizzle)
- ⏳ **Phase 7: Full Integration & End-to-End Testing**

---

## Render and Supabase Development Setup

The current dashboards and demo login still use `mockData.ts`; adding the Supabase client does not migrate demo users or attendance records automatically. Do not use the demo role switcher as real authentication. The setup below creates the deployment and database foundation; wiring each dashboard to live records is a separate integration step.

### 1. Create the Supabase project

1. Create a project at [supabase.com/dashboard](https://supabase.com/dashboard).
2. In **SQL Editor**, run [`supabase/schema.sql`](./supabase/schema.sql).
3. In **Project Settings → API**, copy the project URL and the publishable key (or legacy `anon` key). Never put the `service_role` key in this frontend.
4. For local development, copy `frontend/.env.example` to `frontend/.env.local` and fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Restart Vite after changing environment variables.

The schema enables row-level security. The first user profile is created as a student; create faculty/admin accounts and assign those roles only from a trusted Supabase dashboard or server-side process, never from browser code.

### 2. Deploy the frontend on Render

1. Push this repository to GitHub, then in Render choose **New → Blueprint** and connect the repository. Render reads [`render.yaml`](./render.yaml) and creates a static site.
2. In the Render service's **Environment** settings, set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to the values from Supabase. These are public frontend build variables; do not add the Supabase `service_role` key.
3. Trigger a deploy. Render builds `frontend` and publishes `frontend/dist`; the rewrite rule supports client-side routes such as `/student` and `/admin`.

To deploy later updates, push commits to the connected Git branch and Render will rebuild the static site. If the repository is private, authorize Render to access it during the Blueprint setup.

### Current integration boundary

The optional Supabase client is in [`frontend/src/lib/supabase.ts`](./frontend/src/lib/supabase.ts). It initializes only when both Vite variables exist. At this stage, the login flow, dashboards, and attendance actions are still demo-only and do not read or write Supabase rows. Before real student data is used, implement Supabase Auth, trusted profile provisioning, and live attendance queries/mutations, then test the RLS policies with student, faculty, and admin accounts.
