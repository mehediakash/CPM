import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import BookParcel from "./pages/customer/BookParcel";
import MyParcels from "./pages/customer/MyParcels";
import CustomerLayout from "./layout/CustomerLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AgentDashboard from "./pages/agent/AgentDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/customer"
          element={<ProtectedRoute roles={["customer"]}><CustomerLayout /></ProtectedRoute>}
        >
          <Route path="book" element={<BookParcel />} />
          <Route path="my-parcels" element={<MyParcels />} />
        </Route>

        <Route
          path="/admin"
          element={<ProtectedRoute roles={["admin"]}><AdminDashboard /></ProtectedRoute>}
        />

        <Route
          path="/agent"
          element={<ProtectedRoute roles={["agent"]}><AgentDashboard /></ProtectedRoute>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;