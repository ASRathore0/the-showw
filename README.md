# THE SHOW — Production Entertainment & Live Event Platform

A complete, production-quality web application built for **The JP Yadav Show**, the premier Bhojpuri comedy and entertainment platform. 

The application features a **cinematic public website**, **multi-step audition submission flow**, **interactive seat booking engine with mock payments**, **customer portal**, and an **operational SaaS admin dashboard**.

---

## 🚀 Tech Stack

### Frontend
- **React 18** + **Vite**
- **React Router 6** (Single Page Application routing)
- **Axios** (API communication with Bearer Token interceptors)
- **Tailwind CSS v4** + **Lucide React Icons**
- **Recharts** (Analytics and SaaS reports)

### Backend
- **Laravel REST API**
- **Laravel Sanctum Authentication**
- **SQLite / MySQL Database Support**
- **Form Requests & Validation**
- **Eloquent Models & Migrations**
- **Database Seeders** with realistic test data

---

## 🎨 Visual Design Aesthetics
- **Public Platform:** Cinematic Dark OTT aesthetic (Deep Black `#080808`, `#0D0D0D`, Cinematic Red `#B51D2A`, `#6E0F18`, White `#FFFFFF`, Muted `#A1A1A1`, with gold accent `#D6A84F` used very sparingly).
- **Admin Dashboard:** High-density Operational SaaS layout with metrics cards, Recharts data visualization, status badges, applicant scoring panels, and calendar scheduling modals.

---

## 📁 Repository Structure

```text
/jp-yadav-show
    /frontend
        ├── public/assets/images/ (Logo, SVG badge, hero posters)
        ├── src/
        │   ├── api/ (Axios client)
        │   ├── components/ (Navbar, Footer, HeroVideo, SeatMap, ShowCard, AuditionCard, EpisodeCard, AdminSidebar, AdminHeader)
        │   ├── context/ (AuthContext state management)
        │   ├── pages/ (Home, About, Auditions, AuditionApply, Shows, ShowDetail, SeatBooking, Checkout, BookingSuccess, Episodes, Gallery, Contact, Login, Register, Dashboard)
        │   └── pages/admin/ (AdminDashboard, AdminApplicants, AdminShows, AdminBookings, AdminCustomers, AdminPerformers, AdminReports, AdminSettings)
        └── package.json

    /backend
        ├── app/
        │   ├── Http/Controllers/Api/ (AuthController, ShowController, AuditionController, BookingController, EpisodeController, GalleryController, UserController, AdminController)
        │   └── Models/ (User, Role, Audition, AuditionApplication, AuditionSchedule, AuditionScore, Show, TicketCategory, Seat, Booking, Payment, Ticket, Performer, Episode, GalleryAlbum, GalleryImage)
        ├── database/
        │   ├── migrations/ (Schema definition with foreign keys & status enums)
        │   └── seeders/ (DatabaseSeeder with demo users, shows, seats, auditions, 30+ applications, scores, bookings)
        └── routes/api.php
```

---

## 🔑 Demo Credentials

### 1. Super Admin Account
- **Email:** `admin@example.com`
- **Password:** `password`
- **Role:** `admin` (Full access to operational SaaS admin portal)

### 2. Demo Customer / Performer Account
- **Email:** `demo@example.com`
- **Password:** `password`
- **Role:** `user` (Access to ticket dashboard & audition application tracker)

> *Note: On the `/login` page, there are handy one-click buttons to auto-fill both demo admin and user credentials for fast testing!*

---

## 🛠️ Quick Start & Running Locally

### Prerequisites
- **PHP 8.2+** with PDO SQLite or MySQL enabled
- **Composer 2.x**
- **Node.js v20+ / v22+** & **npm**

### Step 1: Start Laravel Backend Server
```bash
cd backend
php artisan migrate --force
php artisan db:seed --force
php artisan serve --port=8000
```
*Backend REST API running at: `http-[#080808]` / `http://127.0.0.1:8000/api`*

### Step 2: Start React Frontend Server
Open a second terminal window:
```bash
cd frontend
npm run dev
```
*Frontend Application running at: `http://localhost:5173`*

---

## 📡 REST API Structure

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/shows` | List upcoming live show tour dates & categories | Public |
| `GET` | `/api/shows/{id}` | Get show details & performer cast | Public |
| `GET` | `/api/shows/{id}/seats` | Fetch interactive seat map grid by category | Public |
| `GET` | `/api/auditions` | List active audition talent searches | Public |
| `GET` | `/api/auditions/{id}` | Get audition details & guidelines | Public |
| `POST` | `/api/auditions/{id}/apply` | Submit multi-step audition application | Public/User |
| `POST` | `/api/bookings` | Create seat reservation & mock payment | Public/User |
| `GET` | `/api/bookings/{id}` | Get ticket confirmation pass with QR code | Public/User |
| `GET` | `/api/episodes` | List OTT digital video episodes | Public |
| `GET` | `/api/gallery` | Fetch photo gallery images by category | Public |
| `POST` | `/api/auth/login` | User & Admin authentication | Public |
| `POST` | `/api/auth/register` | User registration | Public |
| `GET` | `/api/user/dashboard` | User account summary & recent tickets/auditions | Authenticated |
| `GET` | `/api/admin/dashboard` | SaaS Admin operational metrics & Recharts data | Admin |
| `GET` | `/api/admin/applicants` | Applicant management table with filter & search | Admin |
| `PATCH` | `/api/admin/applicants/{id}/status` | Update applicant status & judge evaluation score | Admin |
| `POST` | `/api/admin/audition-schedules` | Assign audition date, time, & venue to candidate | Admin |
| `POST` | `/api/admin/shows` | Create new show (auto-generates categories & seats) | Admin |
| `GET` | `/api/admin/reports` | Get revenue by city & export CSV report | Admin |

---

## ✅ Acceptance Test Verification Summary
1. **Flow 1 (Auditions):** User opens `/auditions` → selects an opportunity → completes 4-step form → gets application ID (`JPA-2026-XXXX`) → application appears in `/dashboard/auditions` with pipeline status timeline.
2. **Flow 2 (Seat Selection & Booking):** User opens `/shows` → chooses event → selects seats (VIP/Premium/Gold/Silver) on visual map → proceeds to checkout → selects mock payment (UPI/Card/Net Banking) → booking confirmed (`JPS-2026-XXXX`) → seats marked booked → QR ticket generated.
3. **Flow 3 (Admin Applicant Review):** Admin opens `/admin/applicants` → reviews candidate video & details → updates status (`Shortlisted` / `Audition Scheduled`) → assigns date, time & location → candidate timeline updates in real-time.
4. **Flow 4 (Admin Show Creation):** Admin opens `/admin/shows` → creates event → system automatically generates VIP, Premium, Gold, Silver seat categories and seat codes.
5. **Flow 5 (Analytics):** Admin opens `/admin/reports` → views Recharts revenue by city and talent application charts → exports CSV file.
