import React from "react";
import { Button, Layout, Menu } from "antd";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  DashboardOutlined,
  TableOutlined,
  TeamOutlined,
  LogoutOutlined
} from "@ant-design/icons";
import { logout } from "../utils/auth";

const { Header, Content, Sider } = Layout;

const AdminLayout = () => {
  const location = useLocation();
    const navigate = useNavigate();
  const selectedKey = () => {
    if (location.pathname.includes("metrics")) return "1";
    if (location.pathname.includes("bookings")) return "2";
    if (location.pathname.includes("users")) return "3";
    return "1";
  };
     const handleLogout = () => {
      logout(); 
      navigate("/login");
    };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div className="text-white text-center text-lg font-bold py-4">Admin Panel</div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={[selectedKey()]}> 
          <Menu.Item key="1" icon={<DashboardOutlined />}>
            <Link to="metrics">Parcel Metrics</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<TableOutlined />}>
            <Link to="bookings">All Bookings</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<TeamOutlined />}>
            <Link to="users">All Users</Link>
          </Menu.Item>
          <Menu.Item key="4" icon={<LogoutOutlined />} onClick={handleLogout}>
      

            Logout
     
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header  style={{ background: "#fff ",  textAlign: "center", height:"100px" }}>
          <h1 className="text-xl font-semibold  ">Admin Dashboard</h1>
        </Header>
        <Content style={{ margin: "24px 16px 0" }}>
          <div className="p-6 bg-white rounded shadow-md">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
