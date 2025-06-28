import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { Card, Row, Col } from "antd";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const ParcelMetrics = () => {
  const [metrics, setMetrics] = useState({ daily: 0, failed: 0, codAmount: 0 });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchMetrics = async () => {
      const res = await API.get("/parcels/metrics");
      setMetrics(res.data);
      setChartData(res.data.last7Days);
    };
    fetchMetrics();
  }, []);

  return (
    <>
      <Row gutter={16} className="mb-6">
        <Col span={8}><Card title="📦 Daily Bookings">{metrics.daily}</Card></Col>
        <Col span={8}><Card title="❌ Failed Deliveries">{metrics.failed}</Card></Col>
        <Col span={8}><Card title="💰 COD Collected">৳{metrics.codAmount}</Card></Col>
      </Row>
      <Card title="📊 Last 7 Days Bookings">
        <ResponsiveContainer width="100%" height={300}>
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