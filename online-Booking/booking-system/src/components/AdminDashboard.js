import React, { useEffect, useState } from "react";
import axios from "axios";
import UsersTable from "./UsersTable";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/admin/users", {
        withCredentials: true,
      });
      setUsers(response.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <UsersTable users={users} refreshUsers={fetchUsers} />
    </div>
  );
};

export default AdminDashboard;
