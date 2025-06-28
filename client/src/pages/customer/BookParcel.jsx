// src/pages/customer/BookParcel.jsx
import React, { useState } from "react";
import { Form, Input, Select, Button, notification } from "antd";
import API from "../../api/axios";

const { Option } = Select;

const BookParcel = () => {
  const [submitting, setSubmitting] = useState(false);

  const onFinish = (values) => {
    if (!navigator.geolocation) {
      return notification.error({ message: "Geolocation not supported." });
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const payload = {
          ...values,
          location: {
            lat: latitude,
            lng: longitude,
          },
        };

        try {
          setSubmitting(true);
          await API.post("/parcels", payload);
          notification.success({ message: "Parcel booked successfully!" });
        } catch (err) {
          console.error(err);
          notification.error({ message: "Booking failed." });
        } finally {
          setSubmitting(false);
        }
      },
      (error) => {
        notification.error({ message: "Failed to get location." });
        console.error(error);
        setSubmitting(false);
      }
    );
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Book a Parcel</h2>
      <Form layout="vertical" onFinish={onFinish} initialValues={{ parcelSize: "Small", paymentMethod: "COD" }}>
        <Form.Item name="pickupAddress" label="Pickup Address" rules={[{ required: true }]}>
          <Input placeholder="Enter pickup address" />
        </Form.Item>

        <Form.Item name="deliveryAddress" label="Delivery Address" rules={[{ required: true }]}>
          <Input placeholder="Enter delivery address" />
        </Form.Item>

        <Form.Item name="parcelSize" label="Parcel Size">
          <Select>
            <Option value="Small">Small</Option>
            <Option value="Medium">Medium</Option>
            <Option value="Large">Large</Option>
          </Select>
        </Form.Item>

        <Form.Item name="paymentMethod" label="Payment Method">
          <Select>
            <Option value="COD">Cash on Delivery</Option>
            <Option value="Prepaid">Prepaid</Option>
          </Select>
        </Form.Item>

        <Form.Item
          noStyle
          shouldUpdate={(prev, curr) => prev.paymentMethod !== curr.paymentMethod}
        >
          {({ getFieldValue }) =>
            getFieldValue("paymentMethod") === "COD" ? (
              <Form.Item name="codAmount" label="COD Amount" rules={[{ required: true }]}>
                <Input type="number" placeholder="Enter COD amount" />
              </Form.Item>
            ) : null
          }
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={submitting}>
            Book Parcel
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default BookParcel;
