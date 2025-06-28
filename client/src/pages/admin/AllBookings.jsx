import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { Table, Select, notification } from "antd";

const AllBookings = () => {
  const [parcels, setParcels] = useState([]);
  const [agents, setAgents] = useState([]);
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [parcelsRes, usersRes] = await Promise.all([
          API.get("/parcels"),
          API.get("/users"),
        ]);
        setParcels(parcelsRes.data);
        setAgents(usersRes.data.filter((u) => u.role === "agent"));
      } catch (err) {
        api.error({
          message: "Failed to load data",
          description: "Could not fetch parcels or users.",
          placement: "topRight",
        });
      }
    };
    fetchData();
  }, []);

  const assignAgent = async (parcelId, agentId) => {
    try {
      await API.put(`/parcels/assign/${parcelId}`, { agentId });
      const res = await API.get("/parcels");
      setParcels(res.data);

      const agentName = agents.find((a) => a._id === agentId)?.name || "Agent";
      api.success({
        message: " Agent Assigned",
        description: `${agentName} has been assigned successfully.`,
        placement: "topRight",
      });
    } catch (err) {
      api.error({
        message: " Assignment Failed",
        description: err?.response?.data?.error || "Could not assign agent.",
        placement: "topRight",
      });
    }
  };

  const columns = [
    { title: "ID", dataIndex: "_id" },
    {
      title: "Customer",
      dataIndex: ["customerId", "name"],
      render: (text) => text || "N/A",
    },
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
            <Select.Option key={a._id} value={a._id}>
              {a.name}
            </Select.Option>
          ))}
        </Select>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={parcels}
        pagination={{ pageSize: 10 }}
      />
    </>
  );
};

export default AllBookings;
