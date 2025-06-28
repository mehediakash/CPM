import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { Table, Select } from "antd";

const AllBookings = () => {
  const [parcels, setParcels] = useState([]);
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [parcelsRes, usersRes] = await Promise.all([
        API.get("/parcels"),
        API.get("/users")
      ]);
      setParcels(parcelsRes.data);
      setAgents(usersRes.data.filter((u) => u.role === "agent"));
    };
    fetchData();
  }, []);

  const assignAgent = async (parcelId, agentId) => {
    await API.put(`/parcels/assign/${parcelId}`, { agentId });
    const res = await API.get("/parcels");
    setParcels(res.data);
  };

  const columns = [
    { title: "ID", dataIndex: "_id" },
    { title: "Customer", dataIndex: ["customerId", "email"], render: (text) => text || "N/A" },
    { title: "Status", dataIndex: "status" },
    {
      title: "Assign Agent",
      render: (record) => (
        <Select
          style={{ width: 200 }}
          value={record.assignedAgent?._id || undefined}
          onChange={(value) => assignAgent(record._id, value)}
          placeholder="Select Agent"
        >
          {agents.map((a) => (
            <Select.Option key={a._id} value={a._id}>{a.name}</Select.Option>
          ))}
        </Select>
      )
    }
  ];

  return <Table rowKey="_id" columns={columns} dataSource={parcels} pagination={{ pageSize: 10 }} />;
};

export default AllBookings;