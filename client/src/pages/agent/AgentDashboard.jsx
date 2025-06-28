import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { logout } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import {
  Layout,
  Table,
  Select,
  Button,
  Typography,
  Space,
  Card,
  notification,
  Spin,
  Popconfirm,
  List,
  Grid,
} from "antd";
import {
  LogoutOutlined,
  EnvironmentOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;
const { Header, Content } = Layout;

const statusOptions = ["Picked Up", "In Transit", "Delivered", "Failed"];

const containerStyle = {
  width: "100%",
  height: "350px",
};

const defaultCenter = {
  lat: 23.8103,
  lng: 90.4125,
};

const AgentDashboard = () => {
  const [parcels, setParcels] = useState([]);
  const [locations, setLocations] = useState([]);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [loadingParcels, setLoadingParcels] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(null); // parcelId of updating
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDlY82dZtF3EPsfAB847oKsKWEug0Mq4jM", // replace with your API key
  });

  // Detect mobile screen
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // you can adjust breakpoint here
    };
    handleResize(); // initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchAssignedParcels = async () => {
    setLoadingParcels(true);
    try {
      const res = await API.get("/parcels/assigned");
      setParcels(res.data);
      const locs = res.data
        .flatMap((p) => p.locationHistory || [])
        .map((l) => ({ lat: l.lat, lng: l.lng }));
      if (locs.length) setMapCenter(locs[0]);
      setLocations(locs);
    } catch (err) {
      notification.error({
        message: "Error",
        description: "Failed to fetch assigned parcels.",
      });
    } finally {
      setLoadingParcels(false);
    }
  };

  useEffect(() => {
    fetchAssignedParcels();
  }, []);

  const updateStatus = async (parcelId, status) => {
    if (!status) return; // ignore empty selection
    if (!navigator.geolocation) {
      notification.error({
        message: "Error",
        description: "Geolocation not supported in your browser.",
      });
      return;
    }

    setLoadingStatus(parcelId);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          await API.put(`/parcels/status/${parcelId}`, {
            status,
            lat: latitude,
            lng: longitude,
          });
          notification.success({
            message: "Success",
            description: `Parcel status updated to "${status}".`,
          });
          fetchAssignedParcels();
        } catch (err) {
          notification.error({
            message: "Error",
            description: "Failed to update status.",
          });
        } finally {
          setLoadingStatus(null);
        }
      },
      (error) => {
        notification.error({
          message: "Error",
          description: "Failed to get location. Please allow location access.",
        });
        setLoadingStatus(null);
      }
    );
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const columns = [
    {
      title: "Parcel ID",
      dataIndex: "_id",
      key: "_id",
      responsive: ["md"],
      render: (text) => <Text code>{text}</Text>,
    },
    {
      title: "Customer",
      dataIndex: ["customerId", "name"],
      key: "customer",
      render: (name) => name || "N/A",
      responsive: ["sm"],
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      responsive: ["sm"],
      render: (status) => <Text strong>{status}</Text>,
    },
    {
      title: "Update Status",
      key: "update",
      render: (_, record) => (
        <Popconfirm
          title={`Update status of parcel ${record._id}?`}
          onConfirm={() => updateStatus(record._id, record.status)}
          okText="Yes"
          cancelText="No"
        >
          <Select
            value={record.status}
            onChange={(value) => updateStatus(record._id, value)}
            loading={loadingStatus === record._id}
            style={{ minWidth: 140 }}
          >
            <Option value="">-- Select Status --</Option>
            {statusOptions.map((status) => (
              <Option key={status} value={status}>
                {status}
              </Option>
            ))}
          </Select>
        </Popconfirm>
      ),
      responsive: ["sm"],
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#001529",
          color: "#fff",
          padding: "0 20px",
        }}
      >
        <Title level={4} style={{ color: "#fff", margin: 0 }}>
          Agent Dashboard
           <EnvironmentOutlined style={{ marginLeft: 10, color: "#52c41a" }} />
        </Title>

        <Space>
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={fetchAssignedParcels}
            loading={loadingParcels}
          >
            Refresh
          </Button>
          <Button
            danger
            type="primary"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Space>
      </Header>

      <Content style={{ padding: 24, maxWidth: 1200, margin: "auto" }}>
        <Card
          title="Delivery Route Map"
          style={{ marginBottom: 24 }}
          bodyStyle={{ padding: 0 }}
        >
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={mapCenter}
              zoom={12}
            >
              {locations.map((loc, i) => (
                <Marker
                  key={`${loc.lat}-${loc.lng}-${i}`}
                  position={loc}
                  label={`${i + 1}`}
                />
              ))}
            </GoogleMap>
          ) : (
            <div style={{ textAlign: "center", padding: 40 }}>
              <Spin size="large" tip="Loading map..." />
            </div>
          )}
        </Card>

        {isMobile ? (
          <List
            dataSource={parcels}
            loading={loadingParcels}
            grid={{ gutter: 16, column: 1 }}
            renderItem={(parcel) => (
              <List.Item key={parcel._id}>
                <Card
                  title={<Text code>{parcel._id}</Text>}
                  extra={
                    <Select
                      value={parcel.status}
                      onChange={(value) => updateStatus(parcel._id, value)}
                      loading={loadingStatus === parcel._id}
                      style={{ minWidth: 140 }}
                    >
                      <Option value="">-- Select Status --</Option>
                      {statusOptions.map((status) => (
                        <Option key={status} value={status}>
                          {status}
                        </Option>
                      ))}
                    </Select>
                  }
                >
                  <p>
                    <Text strong>Customer: </Text>
                    {parcel.customerId?.name || "N/A"}
                  </p>
                  <p>
                    <Text strong>Status: </Text>
                    <Text strong>{parcel.status}</Text>
                  </p>
                </Card>
              </List.Item>
            )}
          />
        ) : (
          <Card title="My Assigned Parcels">
            <Table
              dataSource={parcels}
              columns={columns}
              rowKey={(record) => record._id}
              loading={loadingParcels}
              pagination={{ pageSize: 5, responsive: true }}
              scroll={{ x: "max-content" }}
            />
          </Card>
        )}
      </Content>
    </Layout>
  );
};

export default AgentDashboard;
