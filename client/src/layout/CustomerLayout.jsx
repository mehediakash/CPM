import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";

const CustomerLayout = () => {
    const navigate = useNavigate();

   const handleLogout = () => {
    logout(); // clears localStorage
    navigate("/login");
  };
  return (
    <div className="flex">
      <aside className="w-64 h-screen bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-6">Customer Dashboard</h2>
        <button onClick={handleLogout}>Logout</button>
        
        <nav className="space-y-2">
          <Link to="/customer/book" className="block hover:underline">📦 Book Parcel</Link>
          <Link to="/customer/my-parcels" className="block hover:underline">📜 My Parcels</Link>
        </nav>
      </aside>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default CustomerLayout;