import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const statusOptions = ["Picked Up", "In Transit", "Delivered", "Failed"];

const containerStyle = {
  width: "100%",
  height: "300px",
};

const defaultCenter = {
  lat: 23.8103,
  lng: 90.4125,
};

const AgentDashboard = () => {
  const [parcels, setParcels] = useState([]);
  const [locations, setLocations] = useState([]);
  const [mapCenter, setMapCenter] = useState(defaultCenter);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDlY82dZtF3EPsfAB847oKsKWEug0Mq4jM", // 🔐 Replace with your API key
  });

  const fetchAssignedParcels = async () => {
    try {
      const res = await API.get("/parcels/assigned");
      setParcels(res.data);
      const locs = res.data
        .flatMap((p) => p.locationHistory || [])
        .map((l) => ({ lat: l.lat, lng: l.lng }));
      if (locs.length) setMapCenter(locs[0]);
      setLocations(locs);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  const updateStatus = async (parcelId, status) => {
    if (!navigator.geolocation) return alert("Location not supported");
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        await API.put(`/parcels/status/${parcelId}`, {
          status,
          lat: latitude,
          lng: longitude,
        });
        fetchAssignedParcels();
      } catch (err) {
        console.error("Status Update Error:", err);
      }
    });
  };

  useEffect(() => {
    fetchAssignedParcels();
  }, []);

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold">Agent Dashboard</h2>

      {isLoaded ? (
        <div className="h-[300px] w-full">
          <h1 className="text-lg font-semibold mb-2">Delivery Route Map</h1>
          <GoogleMap mapContainerStyle={containerStyle} center={mapCenter} zoom={12}>
            {locations.map((loc, i) => (
              <Marker key={i} position={loc} label={`${i + 1}`} />
            ))}
          </GoogleMap>
        </div>
      ) : (
        <p>Loading map...</p>
      )}

      <h3 className="text-xl font-semibold mt-6">My Assigned Parcels</h3>
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Customer</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Update</th>
          </tr>
        </thead>
        <tbody>
          {parcels.map((p) => (
            <tr key={p._id}>
              <td className="border px-4 py-2">{p._id}</td>
              <td className="border px-4 py-2">{p.customerId?.email || "N/A"}</td>
              {console.log(p)}
              <td className="border px-4 py-2">{p.status}</td>
              <td className="border px-4 py-2">
                <select
                  value={p.status}
                  onChange={(e) => updateStatus(p._id, e.target.value)}
                  className="border p-1"
                >
                  <option value="">-- Select Status --</option>
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
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

export default AgentDashboard;