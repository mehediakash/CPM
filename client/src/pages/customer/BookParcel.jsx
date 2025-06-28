import React, { useState } from "react";
import { Form, Input, Select, Button, notification } from "antd";
import API from "../../api/axios";

const { Option } = Select;

const BookParcel = () => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [api, contextHolder] = notification.useNotification(); // 

  const onFinish = (values) => {
    if (!navigator.geolocation) {
      return api.error({
        message: "Geolocation Not Supported",
        description: "Your browser does not support geolocation.",
        placement: "topRight",
      });
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

          api.success({
            message: " Parcel Booked",
            description: `Delivery to: ${values.deliveryAddress}`,
            placement: "topRight",
          });

          form.resetFields(); 
        } catch (err) {
          api.error({
            message: " Booking Failed",
            description:
              err?.response?.data?.error || "Something went wrong. Try again.",
            placement: "topRight",
          });
        } finally {
          setSubmitting(false);
        }
      },
      (error) => {
        api.error({
          message: " Location Access Denied",
          description: "Please allow location permission to book a parcel.",
          placement: "topRight",
        });
        setSubmitting(false);
      }
    );
  };

  return (
    <div className="max-w-2xl mx-auto">
      {contextHolder} 
      <h2 className="text-2xl font-bold mb-4">📦 Book a Parcel</h2>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ parcelSize: "Small", paymentMethod: "COD" }}
      >
        <Form.Item
          name="pickupAddress"
          label="Pickup Address"
          rules={[{ required: true, message: "Enter pickup address" }]}
        >
          <Input placeholder="Enter pickup address" />
        </Form.Item>

        <Form.Item
          name="deliveryAddress"
          label="Delivery Address"
          rules={[{ required: true, message: "Enter delivery address" }]}
        >
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

        <Form.Item noStyle shouldUpdate>
          {({ getFieldValue }) =>
            getFieldValue("paymentMethod") === "COD" ? (
              <Form.Item
                name="codAmount"
                label="COD Amount"
                rules={[{ required: true, message: "Enter COD amount" }]}
              >
                <Input type="number" placeholder="Enter COD amount" />
              </Form.Item>
            ) : null
          }
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={submitting} block>
            Book Parcel
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default BookParcel;
