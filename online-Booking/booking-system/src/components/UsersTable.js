import React from "react";
import axios from "axios";

const UsersTable = ({ users, refreshUsers }) => {
  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/admin/users/${userId}`, {
        withCredentials: true,
      });
      refreshUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  return (
    <table className="min-w-full border-collapse">
      <thead>
        <tr>
          <th className="border px-4 py-2">Name</th>
          <th className="border px-4 py-2">Email</th>
          <th className="border px-4 py-2">Phone</th>
          <th className="border px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td className="border px-4 py-2">{user.full_name}</td>
            <td className="border px-4 py-2">{user.email}</td>
            <td className="border px-4 py-2">{user.phone_number}</td>
            <td className="border px-4 py-2">
              <button
                onClick={() => handleDelete(user.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UsersTable;
