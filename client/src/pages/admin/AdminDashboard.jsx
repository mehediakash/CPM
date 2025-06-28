// AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { saveAs } from "file-saver";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { logout } from "../../utils/auth";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [parcels, setParcels] = useState([]);
  const [agents, setAgents] = useState([]);
  const [users, setUsers] = useState([]);
  const [metrics, setMetrics] = useState({ daily: 0, failed: 0, codAmount: 0 });
  const [chartData, setChartData] = useState([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    const [parcelsRes, agentsRes, usersRes, metricsRes] = await Promise.all([
      API.get("/parcels"),
      API.get("/users/"),
      API.get("/users"),
      API.get("/parcels/metrics"),
    ]);
    setParcels(parcelsRes.data);
     setAgents(usersRes.data.filter((u) => u.role === "agent")); // ✅ Only agents

    setUsers(usersRes.data);
    setMetrics(metricsRes.data);
    setChartData(metricsRes.data.last7Days || []);
  };

  const assignAgent = async (parcelId, agentId) => {
    await API.put(`/parcels/assign/${parcelId}`, { agentId });
    fetchData();
  };

  const exportCSV = async () => {
    try {
      const response = await API.get("/parcels/export/csv", { responseType: "blob" });
      const blob = new Blob([response.data], { type: "text/csv;charset=utf-8" });
      saveAs(blob, "parcels.csv");
    } catch (error) {
      console.error("CSV Export Error:", error);
    }
  };

  const exportPDF = async () => {
    try {
      const response = await API.get("/parcels/export/pdf", { responseType: "blob" });
      const blob = new Blob([response.data], { type: "application/pdf" });
      saveAs(blob, "parcels.pdf");
    } catch (error) {
      console.error("PDF Export Error:", error);
    }
  };
    const handleLogout = () => {
    logout(); 
    navigate("/login");
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold">Admin Dashboard</h2>
      <button onClick={handleLogout}>Logout</button>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white shadow rounded-xl p-4">📦 Daily Bookings: {metrics.daily}</div>
        <div className="bg-white shadow rounded-xl p-4">❌ Failed Deliveries: {metrics.failed}</div>
        <div className="bg-white shadow rounded-xl p-4">💰 COD Amount: ৳{metrics.codAmount}</div>
      </div>

      <div className="w-full h-[300px]">
       { console.log(chartData)}
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-end gap-2">
        <button onClick={exportCSV} className="bg-green-500 text-white px-4 py-2 rounded">Export CSV</button>
        <button onClick={exportPDF} className="bg-red-500 text-white px-4 py-2 rounded">Export PDF</button>
      </div>

      <h3 className="text-xl font-semibold mt-6">All Bookings</h3>
      <table className="w-full table-auto">
        <thead>
      
          <tr className="bg-gray-100">
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Customer</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Assign Agent</th>
          </tr>
        </thead>
        <tbody>
          {parcels.map((p) => (
            <tr key={p._id}>
              <td className="border px-4 py-2">{p._id}</td>
              <td className="border px-4 py-2">{p.customerId?.email}</td>
              <td className="border px-4 py-2">{p.status}</td>
              <td className="border px-4 py-2">
                <select
                  onChange={(e) => assignAgent(p._id, e.target.value)}
                  value={p.assignedAgent?._id || ""}
                  className="border p-1"
                >
                  {/* i want to show here only who role in agent */}
                  <option value="">-- Select Agent --</option>
                  {agents.map((a) => (
                    <option key={a._id} value={a._id}>{a.name}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="text-xl font-semibold mt-6">All Users</h3>
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td className="border px-4 py-2">{u.name}</td>
              <td className="border px-4 py-2">{u.email}</td>
              <td className="border px-4 py-2">{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
