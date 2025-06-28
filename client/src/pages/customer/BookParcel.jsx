// src/pages/customer/BookParcel.jsx

import React, { useState } from "react";
import API from "../../api/axios";

const BookParcel = () => {
  const [form, setForm] = useState({
    pickupAddress: "",
    deliveryAddress: "",
    parcelSize: "Small",
    paymentMethod: "COD",
    codAmount: 0,
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (!navigator.geolocation) {
      alert("Geolocation not supported.");
      return setSubmitting(false);
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        const payload = {
          ...form,
          location: {
            lat: latitude,
            lng: longitude,
          },
        };

        try {
          await API.post("/parcels", payload);
          alert("Parcel booked successfully!");
          setForm({
            pickupAddress: "",
            deliveryAddress: "",
            parcelSize: "Small",
            paymentMethod: "COD",
            codAmount: 0,
          });
        } catch (err) {
          console.error(err);
          alert("Failed to book parcel");
        } finally {
          setSubmitting(false);
        }
      },
      (error) => {
        alert("Failed to get location.");
        console.error(error);
        setSubmitting(false);
      }
    );
  };

  return (
    <div>
      <h2 className="text-2xl mb-4">Book a Parcel</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <input
          name="pickupAddress"
          placeholder="Pickup Address"
          className="border w-full p-2"
          value={form.pickupAddress}
          onChange={handleChange}
        />
        <input
          name="deliveryAddress"
          placeholder="Delivery Address"
          className="border w-full p-2"
          value={form.deliveryAddress}
          onChange={handleChange}
        />

        <select
          name="parcelSize"
          className="border w-full p-2"
          value={form.parcelSize}
          onChange={handleChange}
        >
          <option value="Small">Small</option>
          <option value="Medium">Medium</option>
          <option value="Large">Large</option>
        </select>

        <select
          name="paymentMethod"
          className="border w-full p-2"
          value={form.paymentMethod}
          onChange={handleChange}
        >
          <option value="COD">Cash on Delivery</option>
          <option value="Prepaid">Prepaid</option>
        </select>

        {form.paymentMethod === "COD" && (
          <input
            name="codAmount"
            type="number"
            placeholder="COD Amount"
            className="border w-full p-2"
            value={form.codAmount}
            onChange={handleChange}
          />
        )}

        <button className="bg-green-600 text-white px-4 py-2" disabled={submitting}>
          {submitting ? "Booking..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default BookParcel;
