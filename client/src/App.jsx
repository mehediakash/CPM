import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import BookParcel from "./pages/customer/BookParcel";
import MyParcels from "./pages/customer/MyParcels";
import LiveTracking from "./pages/customer/LiveTracking";
import CustomerLayout from "./layout/CustomerLayout";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AgentDashboard from "./pages/agent/AgentDashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
import AdminLayout from "./layout/AdminLayout";
import ParcelMetrics from "./pages/admin/ParcelMetrics";
import AllBookings from "./pages/admin/AllBookings";
import AllUsers from "./pages/admin/AllUsers";

function App() {
  return (
    <BrowserRouter>
      <Routes>
    
        <Route
          path="/login"
          element={
            <UnauthenticatedRoute>
              <Login />
            </UnauthenticatedRoute>
          }
        />
        <Route
          path="/signup"
          element={    <UnauthenticatedRoute> <Register /></UnauthenticatedRoute>}
        />

        <Route
          path="/customer"
          element={
            <ProtectedRoute roles={["customer"]}>
              <CustomerLayout />
            </ProtectedRoute>
          }
        >
          <Route path="book" element={<BookParcel />} />
          <Route path="my-parcels" element={<MyParcels />} />
          <Route path="tracking/:parcelId" element={<LiveTracking />} />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ParcelMetrics />} />
          <Route path="bookings" element={<AllBookings />} />
          <Route path="users" element={<AllUsers />} />
        </Route>


        <Route
          path="/agent"
          element={
            <ProtectedRoute roles={["agent"]}>
              <AgentDashboard />
            </ProtectedRoute>
          }
        />

     
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
