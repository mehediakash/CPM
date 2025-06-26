import React, { useEffect, useState } from "react";
import API from "../../api/axios";

const AdminDashboard = () => {
  const [parcels, setParcels] = useState([]);
  const [agents, setAgents] = useState([]);

  const fetchParcels = async () => {
    const { data } = await API.get("/parcels");
    setParcels(data);
  };

  const fetchAgents = async () => {
    const { data } = await API.get("/users/agents");
    setAgents(data);
  };

  const assignAgent = async (parcelId, agentId) => {
    await API.put(`/parcels/${parcelId}/assign`, { agentId });
    fetchParcels();
  };

  useEffect(() => {
    fetchParcels();
    fetchAgents();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>
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
              <td className="border px-4 py-2">{p.customer?.email}</td>
              <td className="border px-4 py-2">{p.status}</td>
              <td className="border px-4 py-2">
                <select
                  onChange={(e) => assignAgent(p._id, e.target.value)}
                  value={p.assignedAgent?._id || ""}
                  className="border p-1"
                >
                  <option value="">-- Select Agent --</option>
                  {agents.map((a) => (
                    <option key={a._id} value={a._id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;