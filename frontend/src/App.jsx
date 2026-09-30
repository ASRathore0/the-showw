import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Auditions from './pages/Auditions';
import AuditionDetail from './pages/AuditionDetail';
import AuditionApply from './pages/AuditionApply';
import Shows from './pages/Shows';
import ShowDetail from './pages/ShowDetail';
import SeatBooking from './pages/SeatBooking';
import Checkout from './pages/Checkout';
import BookingSuccess from './pages/BookingSuccess';
import Episodes from './pages/Episodes';
import EpisodeDetail from './pages/EpisodeDetail';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';

// User Dashboard Pages
import Dashboard from './pages/Dashboard';
import DashboardTickets from './pages/DashboardTickets';
import DashboardAuditions from './pages/DashboardAuditions';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminApplicants from './pages/admin/AdminApplicants';
import AdminShows from './pages/admin/AdminShows';
import AdminBookings from './pages/admin/AdminBookings';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminPerformers from './pages/admin/AdminPerformers';
import AdminEpisodes from './pages/admin/AdminEpisodes';
import AdminGallery from './pages/admin/AdminGallery';
import AdminReports from './pages/admin/AdminReports';
import AdminSettings from './pages/admin/AdminSettings';

function AppRoutes() {
  return (
    <Routes>
      {/* Public Website Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/auditions" element={<Auditions />} />
      <Route path="/auditions/:id" element={<AuditionDetail />} />
      <Route path="/auditions/:id/apply" element={<AuditionApply />} />
      <Route path="/shows" element={<Shows />} />
      <Route path="/shows/:id" element={<ShowDetail />} />
      <Route path="/shows/:id/seats" element={<SeatBooking />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/booking/success" element={<BookingSuccess />} />
      <Route path="/episodes" element={<Episodes />} />
      <Route path="/episodes/:id" element={<EpisodeDetail />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* User Account Dashboard */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/tickets" element={<DashboardTickets />} />
      <Route path="/dashboard/auditions" element={<DashboardAuditions />} />

      {/* Admin Panel Routes */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/applicants" element={<AdminApplicants />} />
      <Route path="/admin/shows" element={<AdminShows />} />
      <Route path="/admin/bookings" element={<AdminBookings />} />
      <Route path="/admin/customers" element={<AdminCustomers />} />
      <Route path="/admin/performers" element={<AdminPerformers />} />
      <Route path="/admin/episodes" element={<AdminEpisodes />} />
      <Route path="/admin/gallery" element={<AdminGallery />} />
      <Route path="/admin/reports" element={<AdminReports />} />
      <Route path="/admin/settings" element={<AdminSettings />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <Router>
          <AppRoutes />
        </Router>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;
