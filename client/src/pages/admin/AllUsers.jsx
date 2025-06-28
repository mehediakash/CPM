import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { Table } from "antd";

const AllUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await API.get("/users");
      setUsers(res.data);
    };
    fetchUsers();
  }, []);

  const columns = [
    { title: "Name", dataIndex: "name" },
    { title: "Email", dataIndex: "email" },
    { title: "Role", dataIndex: "role" },
  ];

  return <Table rowKey="_id" columns={columns} dataSource={users} pagination={{ pageSize: 10 }} />;
};

export default AllUsers;