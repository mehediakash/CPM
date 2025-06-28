import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import {
  Card,
  Row,
  Col,
  Button,
  Space,
  message,
  Table
} from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { CSVLink } from "react-csv";

const ParcelMetrics = () => {
  const [metrics, setMetrics] = useState({ daily: 0, failed: 0, codAmount: 0 });
  const [chartData, setChartData] = useState([]);
  const [exportData, setExportData] = useState([]);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await API.get("/analytics/metrics");
        setMetrics({
          daily: res.data.totalPickedUp || 0,
          failed: res.data.failed || 0,
          codAmount: res.data.totalCOD || 0,
        });
        setChartData(res.data.pickedUpData || []);
        
        setExportData(res.data.details || []);
      } catch (err) {
        message.error("Failed to fetch metrics.");
      }
    };
    fetchMetrics();
  }, []);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Detailed Parcel Report", 14, 14);
    autoTable(doc, {
      startY: 20,
      head: [[
        "Parcel ID",
        "Customer",
        "Pickup Address",
        "Delivery Address",
        "COD (৳)"
      ]],
      body: exportData.map(item => ([
        item._id,
        item.customerId?.name || "N/A",
        item.pickupAddress || "",
        item.deliveryAddress || "",
        item.codAmount || 0
      ]))
    });
    doc.save("parcel_detailed_report.pdf");
  };

  const csvHeaders = [
    { label: "Parcel ID", key: "_id" },
    { label: "Customer", key: "customerId.name" },
    { label: "Pickup Address", key: "pickupAddress" },
    { label: "Delivery Address", key: "deliveryAddress" },

    { label: "COD (৳)", key: "codAmount" }
  ];

  return (
    <>
      <Row gutter={16} className="mb-6">
        <Col span={8}>
          <Card title="📦 Daily Bookings">{metrics.daily}</Card>
        </Col>
        <Col span={8}>
          <Card title="❌ Failed Deliveries">{metrics.failed}</Card>
        </Col>
        <Col span={8}>
          <Card title="💰 COD Collected">৳{metrics.codAmount}</Card>
        </Col>
      </Row>

      <Card
        title=" Last 1 Month Bookings"
        extra={
          <Space>
            <CSVLink
              data={exportData}
              headers={csvHeaders}
              filename="parcel_detailed_report.csv"
            >
              <Button>Export CSV</Button>
            </CSVLink>
            <Button onClick={exportPDF}>Export PDF</Button>
          </Space>
        }
      >
        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#1890ff" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

   
      </Card>
    </>
  );
};

export default ParcelMetrics;
