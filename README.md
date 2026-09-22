# getAjob — Full-Stack Job & Internship Portal

> Modern, responsive, high-performance recruitment portal connecting ambitious students and job seekers with leading companies and hiring managers.

![getAjob Portal](frontend/src/assets/hero-illustration.jpg)

---

## 🚀 Key Highlights

- **Role-Based Architecture**: Complete specialized workflows for **Students**, **Recruiters**, and **System Administrators**.
- **Modern Tech Stack**: React 19, TypeScript, Vite, Tailwind CSS v4, React Router v7, Recharts, and Lucide Icons.
- **Persistent Mock Data & Services**: Fully functional client-side service layer powered by LocalStorage state synchronization with zero setup overhead.
- **Enterprise-Grade UI/UX**: Custom glassmorphism, responsive navigation drawers, interactive pipelines, modal dialogs, and real-time toast notification systems.

---

## 🔑 Demo Access Credentials

| Role | Email | Password | Dashboard URL |
| :--- | :--- | :--- | :--- |
| **Student** | `student@demo.com` | `demo123` | `/student/home` |
| **Recruiter** | `recruiter@demo.com` | `demo123` | `/recruiter/home` |
| **System Admin** | `admin@demo.com` | `demo123` | `/admin/home` |

> *Quick-login buttons for all demo personas are also available directly on the `/login` screen.*

---

## 🗺️ Portal Navigation & Routes

### 🌐 Public & Authentication
- `/` — Landing page with hero illustration, career category tags, and "How It Works"
- `/login` — Email & password sign-in with instant demo profile buttons
- `/register` — Role selection portal (Student vs Recruiter)
- `/register/student` — Multi-step student registration
- `/register/recruiter` — Employer registration with company profile setup
- `/forgot-password` & `/reset-password` — Password recovery flow

### 🎓 Student Dashboard (`/student/*`)
- `/student/home` — Personalized candidate overview, KPI counters, recommended jobs
- `/student/jobs` — Full job marketplace with search, category filtering, salary sliders, and sorting
- `/student/jobs/:id` — Detailed job specification, company card, and "Apply Now" dialog with resume selection
- `/student/applications` — Interactive application tracking list with status badges and full timeline history
- `/student/saved-jobs` — Bookmarked jobs management with quick apply and remove
- `/student/profile` — Comprehensive profile editor (academic details, skills tags, experience, projects, links)
- `/student/resumes` — Document management for CVs/resumes with upload simulation and default assignment
- `/student/notifications` — Notification feed with status change alerts and unread counters
- `/student/settings` — Privacy controls, alert preferences, and password settings

### 💼 Recruiter Dashboard (`/recruiter/*`)
- `/recruiter/home` — Recruitment metrics (views, applications, hiring funnel), recent postings, and active applicants
- `/recruiter/jobs` — Manage company job postings (Active, Draft, Closed) with quick actions
- `/recruiter/jobs/create` — Rich job posting form with responsibilities, requirements, compensation, and deadlines
- `/recruiter/jobs/:id/edit` — Prefilled job editor with status toggles and permanent deletion
- `/recruiter/applicants` — Applicant directory filterable by posting, hiring stage, and search query
- `/recruiter/applicants/:id` — Candidate deep-dive: resume preview/download, cover letter, and multi-stage hiring actions (Review, Shortlist, Schedule Interview, Offer, Reject)
- `/recruiter/company` — Employer branding page (logo, industry, size, location, website, social links)
- `/recruiter/analytics` — Interactive charts powered by Recharts (Growth & Funnel, Candidate Pipeline, Applicants per Job)
- `/recruiter/notifications` & `/recruiter/settings` — Notification feed and account security

### 🛡️ Admin Dashboard (`/admin/*`)
- `/admin/home` — System-wide telemetry (Total users, Active jobs, Verified companies, Open reports)
- `/admin/users` — Directory of all portal accounts with role filtering, profile modal inspection, and suspension/reactivation actions
- `/admin/jobs` — Centralized job moderation queue with review modals and remove capabilities
- `/admin/companies` — Company verification panel to review registration docs and grant Verified badges
- `/admin/reports` — Community abuse moderation queue to action or dismiss reported listings and accounts
- `/admin/settings` — Platform-wide switches (maintenance mode, public registration toggles, system backups)

---

## 🛠️ Project Structure

```
getAjob/
├── frontend/
│   ├── src/
│   │   ├── assets/           # Logos and illustration assets
│   │   ├── components/       # Common reusable UI elements
│   │   ├── context/          # AuthContext, ToastContext
│   │   ├── data/             # Mock data (jobs, companies, users, applications, reports)
│   │   ├── layouts/          # PublicLayout, StudentLayout, RecruiterLayout, AdminLayout
│   │   ├── pages/
│   │   │   ├── public/       # Welcome, 404
│   │   │   ├── auth/         # Login, Register, Password reset
│   │   │   ├── student/      # 9 candidate pages
│   │   │   ├── recruiter/    # 10 employer pages
│   │   │   └── admin/        # 6 platform administration pages
│   │   ├── routes/           # AppRouter, ProtectedRoute with role guards
│   │   ├── services/         # Async localStorage service APIs
│   │   ├── types/            # Complete TypeScript interfaces
│   │   ├── utils/            # Formatting and date helpers
│   │   ├── App.tsx           # Providers and root router injection
│   │   ├── index.css         # Tailwind v4 theme configuration and custom classes
│   │   └── main.tsx          # Application entrypoint
│   ├── package.json
│   └── vite.config.ts
├── .gitignore
└── README.md
```

---

## 💻 Running the Project Locally

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## 📦 GitHub Deployment & Collaboration

```bash
git remote add origin https://github.com/soo6aj/getajob.git
git branch -M main
git push -u origin main
```
