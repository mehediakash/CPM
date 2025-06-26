import React, { useEffect, useState } from "react";
import API from "../../api/axios";

const MyParcels = () => {
  const [parcels, setParcels] = useState([]);

  useEffect(() => {
    const fetchParcels = async () => {
      try {
        const res = await API.get("/parcels/my");
        setParcels(res.data);
      } catch (err) {
        console.error("Failed to load parcels");
      }
    };

    fetchParcels();
  }, []);

  return (
    <div>
      <h2 className="text-2xl mb-4">My Parcels</h2>
      <ul className="space-y-3">
        {parcels.map((parcel) => (
          <li key={parcel._id} className="border p-4">
            <p><strong>Status:</strong> {parcel.status}</p>
            <p><strong>From:</strong> {parcel.pickupAddress}</p>
            <p><strong>To:</strong> {parcel.deliveryAddress}</p>
            <p><strong>Method:</strong> {parcel.paymentMethod}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyParcels;