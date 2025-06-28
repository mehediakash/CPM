import React, { useState } from "react";
import { Layout, Menu, Button } from "antd";
import {
  ShoppingOutlined,
  ProfileOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";

const { Header, Sider, Content } = Layout;

const CustomerLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Determine the selected menu item based on current path
  let selectedKey = "book";
  if (location.pathname.includes("/customer/my-parcels")) selectedKey = "myparcels";

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="lg"
        collapsedWidth="80"
        style={{ backgroundColor: "#001529" }}
      >
        <div
          style={{
            height: 64,
            margin: 16,
            color: "white",
            fontSize: 18,
            fontWeight: "bold",
            textAlign: "center",
            userSelect: "none",
          }}
        >
          {collapsed ? "CD" : "Customer Dashboard"}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          defaultSelectedKeys={["book"]}
        >
          <Menu.Item key="book" icon={<ShoppingOutlined />}>
            <Link to="/customer/book">Book Parcel</Link>
          </Menu.Item>
          <Menu.Item key="myparcels" icon={<ProfileOutlined />}>
            <Link to="/customer/my-parcels">My Parcels</Link>
          </Menu.Item>
        </Menu>
        <div style={{ padding: 16 }}>
          <Button
            type="primary"
            icon={<LogoutOutlined />}
            block
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </Sider>

      <Layout>
        <Header
          style={{
            padding: 0,
            backgroundColor: "#fff",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 20,
          }}
        >
          {selectedKey === "book"
            ? "Book a Parcel"
            : selectedKey === "myparcels"
            ? "My Parcels"
            : "Customer Dashboard"}
        </Header>
        <Content style={{ margin: "24px 16px", padding: 24, background: "#fff" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default CustomerLayout;
