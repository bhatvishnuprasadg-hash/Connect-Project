import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

import UserLogin from "./pages/auth/UserLogin";
import UserRegister from "./pages/auth/UserRegister";
import ProviderLogin from "./pages/auth/ProviderLogin";
import ProviderRegister from "./pages/auth/ProviderRegister";
import ForgotPassword from "./pages/auth/ForgotPassword";

import CustomerDashboard from "./pages/customer/Dashboard";
import ServiceListings from "./pages/customer/ServiceListings";
import ServiceDetails from "./pages/customer/ServiceDetails";
import Booking from "./pages/customer/Booking";
import BookingHistory from "./pages/customer/BookingHistory";
import Reschedule from "./pages/customer/Reschedule";
import Cancel from "./pages/customer/Cancel";
import Feedback from "./pages/customer/Feedback";
import CustomerProfile from "./pages/customer/Profile";

import ProviderDashboard from "./pages/provider/Dashboard";
import ManageServices from "./pages/provider/ManageServices";
import ProviderBookings from "./pages/provider/Bookings";
import Earnings from "./pages/provider/Earnings";
import ProviderProfile from "./pages/provider/Profile";

import Payment from "./pages/payment/Payment";
import PaymentSuccess from "./pages/payment/PaymentSuccess";
import PaymentFailure from "./pages/payment/PaymentFailure";

import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/services" element={<ServiceListings />} />
      <Route path="/services/:id" element={<ServiceDetails />} />

      {/* Auth */}
      <Route path="/login" element={<UserLogin />} />
      <Route path="/register" element={<UserRegister />} />
      <Route path="/provider/login" element={<ProviderLogin />} />
      <Route path="/provider/register" element={<ProviderRegister />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/provider/forgot-password" element={<ForgotPassword />} />

      {/* Customer (protected) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute role="customer">
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/book/:serviceId"
        element={
          <ProtectedRoute role="customer">
            <Booking />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bookings"
        element={
          <ProtectedRoute role="customer">
            <BookingHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reschedule/:bookingId"
        element={
          <ProtectedRoute role="customer">
            <Reschedule />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cancel/:bookingId"
        element={
          <ProtectedRoute role="customer">
            <Cancel />
          </ProtectedRoute>
        }
      />
      <Route
        path="/feedback/:bookingId"
        element={
          <ProtectedRoute role="customer">
            <Feedback />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute role="customer">
            <CustomerProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment/:bookingId"
        element={
          <ProtectedRoute role="customer">
            <Payment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment/success/:bookingId"
        element={
          <ProtectedRoute role="customer">
            <PaymentSuccess />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment/failure/:bookingId"
        element={
          <ProtectedRoute role="customer">
            <PaymentFailure />
          </ProtectedRoute>
        }
      />

      {/* Provider (protected) */}
      <Route
        path="/provider/dashboard"
        element={
          <ProtectedRoute role="provider">
            <ProviderDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/provider/services"
        element={
          <ProtectedRoute role="provider">
            <ManageServices />
          </ProtectedRoute>
        }
      />
      <Route
        path="/provider/bookings"
        element={
          <ProtectedRoute role="provider">
            <ProviderBookings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/provider/earnings"
        element={
          <ProtectedRoute role="provider">
            <Earnings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/provider/profile"
        element={
          <ProtectedRoute role="provider">
            <ProviderProfile />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
