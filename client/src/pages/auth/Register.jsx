import React, { useState } from "react";
import API from "../../api/axios"; // make sure this is your Axios instance
import { isLoggedIn } from "../../utils/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";



const Register = () => {
      const Navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Customer",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await API.post("/auth/register", form);
      setMessage("✅ Registered successfully! Please login.");
      setForm({ name: "", email: "", password: "", role: "Customer" });
    } catch (err) {
      setMessage("❌ Registration failed: " + (err.response?.data?.message || "Server error"));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (isLoggedIn()) {
      Navigate("/agent"); // or wherever your home page is
    }
  }, []);
  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
      {message && <div className="mb-4 text-sm text-center">{message}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="Customer">Customer</option>
          <option value="Agent">Agent</option>
          <option value="Admin">Admin</option>
        </select>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;
