import React, { useEffect, useState } from "react";
import API from "../../api/axios";

const AgentDashboard = () => {
  const [parcels, setParcels] = useState([]);

  const fetchAssignedParcels = async () => {
    const { data } = await API.get("/parcels/assigned");
    setParcels(data);
  };

  const updateStatus = async (parcelId, status) => {
    await API.put(`/parcels/${parcelId}/status`, { status });
    fetchAssignedParcels();
  };

  useEffect(() => {
    fetchAssignedParcels();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Agent Dashboard</h2>
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Pickup</th>
            <th className="px-4 py-2">Delivery</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Update</th>
          </tr>
        </thead>
        <tbody>
          {parcels.map((p) => (
            <tr key={p._id}>
              <td className="border px-4 py-2">{p._id}</td>
              <td className="border px-4 py-2">{p.pickupAddress}</td>
              <td className="border px-4 py-2">{p.deliveryAddress}</td>
              <td className="border px-4 py-2">{p.status}</td>
              <td className="border px-4 py-2">
                <select
                  onChange={(e) => updateStatus(p._id, e.target.value)}
                  value={p.status}
                  className="border p-1"
                >
                  <option value="Picked Up">Picked Up</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Failed">Failed</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AgentDashboard;