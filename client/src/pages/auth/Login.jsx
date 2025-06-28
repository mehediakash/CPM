// src/pages/auth/Login.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "../../utils/auth";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(form));
  };

  useEffect(() => {
    if (user) {
      const roleRoutes = {
        admin: "/admin",
        agent: "/agent",
        customer: "/customer/book", // or just /customer if you use a layout
      };
      navigate(roleRoutes[user.role] || "/");
    }
  }, [user, navigate]);

    useEffect(() => {
    if (isLoggedIn()) {
      navigate("/"); // or wherever your home page is
    }
  }, []);

  return (
    <div className="max-w-sm mx-auto mt-10">
      <h2 className="text-xl mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="border w-full p-2"
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border w-full p-2"
          onChange={handleChange}
        />
        <button
          className="bg-blue-600 text-white p-2 w-full"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
