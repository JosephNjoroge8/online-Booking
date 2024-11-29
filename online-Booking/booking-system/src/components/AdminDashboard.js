import React, { useEffect, useState } from "react";
import "tailwindcss/tailwind.css";
import axios from "axios";
import UsersTable from "./UsersTable";

const Dashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [yesterdayUsers, setYesterdayUsers] = useState(0);
  const [last7DaysUsers, setLast7DaysUsers] = useState(0);
  const [last30DaysUsers, setLast30DaysUsers] = useState(0);
  const [users, setUsers] = useState([]);

  const fetchUserStats = async () => {
    try {
      const response = await axios.get("/api/user-stats", { withCredentials: true });
      const data = response.data;
      setTotalUsers(data.totalUsers);
      setYesterdayUsers(data.yesterdayUsers);
      setLast7DaysUsers(data.last7DaysUsers);
      setLast30DaysUsers(data.last30DaysUsers);
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/admin/users", { withCredentials: true });
      setUsers(response.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchUserStats();
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 p-4 text-white">Admin Dashboard</nav>
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md h-screen">
          <ul className="p-4">
            <li className="mb-4">
              <a href="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</a>
            </li>
            <li>
              <a href="/manage-users" className="text-gray-700 hover:text-blue-600">Manage Users</a>
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardCard
              title="Total Registered Users"
              value={totalUsers}
              bgColor="bg-blue-500"
              link="/manage-users"
            />
            <DashboardCard
              title="Yesterday Registered Users"
              value={yesterdayUsers}
              bgColor="bg-yellow-500"
              link="/yesterday-reg-users"
            />
            <DashboardCard
              title="Users in Last 7 Days"
              value={last7DaysUsers}
              bgColor="bg-green-500"
              link="/lastsevendays-reg-users"
            />
            <DashboardCard
              title="Users in Last 30 Days"
              value={last30DaysUsers}
              bgColor="bg-red-500"
              link="/lastthirtydays-reg-users"
            />
          </div>
          <div className="mt-8">
            <UsersTable users={users} refreshUsers={fetchUsers} />
          </div>
        </main>
      </div>
    </div>
  );
};

const DashboardCard = ({ title, value, bgColor, link }) => (
  <div className={`card ${bgColor} text-white p-4 rounded-lg shadow-md`}>
    <div className="card-body">
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
    <div className="card-footer mt-4 flex justify-between items-center">
      <a href={link} className="text-white underline">View Details</a>
      <i className="fas fa-angle-right"></i>
    </div>
  </div>
);

export default Dashboard;
