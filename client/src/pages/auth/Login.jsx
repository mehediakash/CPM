import React, { useEffect } from "react";
import { Form, Input, Button, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/slices/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn } from "../../utils/auth";
import { notification } from "antd";

const { Title } = Typography;

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    if (user) {
      api.success({
        message: "Login Successful",
        description: `Welcome back, ${user.name}`,
      });

      const roleRoutes = {
        admin: "/admin",
        agent: "/agent",
        customer: "/customer/book",
      };
      navigate(roleRoutes[user.role] || "/");
    }
  }, [user]);

  useEffect(() => {
    if (error) {
      api.error({
        message: "Login Failed",
        description: error,
      });
    }
  }, [error]);

  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/");
    }
  }, []);

  const onFinish = (values) => {
    dispatch(loginUser(values));
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", padding: 24, background: "#fff", borderRadius: 8 }}>
      {contextHolder}
      <Title level={3} style={{ textAlign: "center" }}>Login</Title>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item label="Email" name="email" rules={[{ required: true, message: "Please enter your email" }]}>
          <Input placeholder="Enter your email" />
        </Form.Item>

        <Form.Item label="Password" name="password" rules={[{ required: true, message: "Please enter your password" }]}>
          <Input.Password placeholder="Enter your password" />
        </Form.Item>
        <p>I have not a Account please <Link to={"/signup"}> singup</Link></p>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Login
          </Button>
        </Form.Item>

      </Form>
    </div>
  );
};

export default Login;
