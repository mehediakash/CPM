import React, { useEffect } from "react";
import { Form, Input, Button, Select, Typography } from "antd";
import API from "../../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn } from "../../utils/auth";
import { notification } from "antd";

const { Title } = Typography;

const Register = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/");
    }
  }, []);

  const onFinish = async (values) => {
    try {
      await API.post("/auth/register", values);
      api.success({
        message: "Registration Successful",
        description: "You can now log in.",
      });
      form.resetFields();
      navigate("/login");
    } catch (err) {
      api.error({
        message: "Registration Failed",
        description: err.response?.data?.message || "Something went wrong",
      });
    }
  };

  return (
    <div style={{ maxWidth: 450, margin: "50px auto", padding: 24, background: "#fff", borderRadius: 8 }}>
      {contextHolder}
      <Title level={3} style={{ textAlign: "center" }}>Register</Title>
      <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ role: "Customer" }}>
        <Form.Item label="Full Name" name="name" rules={[{ required: true, message: "Please enter your name" }]}>
          <Input placeholder="Your Name" />
        </Form.Item>

        <Form.Item label="Email" name="email" rules={[{ required: true, message: "Please enter your email" }]}>
          <Input placeholder="you@example.com" />
        </Form.Item>

        <Form.Item label="Password" name="password" rules={[{ required: true, message: "Please enter your password" }]}>
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Form.Item label="Role" name="role">
          <Select>
            <Select.Option value="customer">Customer</Select.Option>
            <Select.Option value="agent">Agent</Select.Option>
            <Select.Option value="admin">Admin</Select.Option>
          </Select>
        </Form.Item>
        <p>I have Allready to  Account <Link to={"/login"}> Login</Link></p>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;
