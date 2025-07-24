import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "https://slbbl-website-backend-version1.onrender.com/api/v1";

const PendingUsers = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [approvingId, setApprovingId] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/pending-users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendingUsers(res.data.pending_users || []);
    } catch {
      setMessage("Failed to load pending users");
    } finally {
      setLoading(false);
    }
  };

  const approveUser = async (id) => {
    if (!window.confirm("Approve this user?")) return;
    setApprovingId(id);
    try {
      await axios.patch(
        `${API_BASE}/admin/approve/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPendingUsers((prev) => prev.filter((user) => user.id !== id));
      alert("✅ User approved successfully!");
    } catch {
      alert("❌ Failed to approve user");
    } finally {
      setApprovingId(null);
    }
  };

  if (loading)
    return (
      <p className="text-center text-gray-600 py-6 text-lg font-medium animate-pulse">
        Loading pending users...
      </p>
    );

  if (!pendingUsers.length)
    return (
      <p className="text-center text-gray-500 py-6 text-lg font-medium">
        No pending users found.
      </p>
    );

  return (
    <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200 mt-6 animate-fade-in">
      <table className="min-w-full border-collapse border border-gray-200">
        <thead className="bg-yellow-50">
          <tr>
            {["ID", "Email", "Username", "Role", "Created At", "Action"].map(
              (header) => (
                <th
                  key={header}
                  className="px-6 py-3 border text-left text-sm font-semibold text-yellow-900"
                >
                  {header}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {pendingUsers.map((user) => (
            <tr
              key={user.id}
              className={`transition duration-300 ease-in-out ${
                approvingId === user.id ? "opacity-30 scale-95" : "hover:bg-yellow-100"
              }`}
            >
              <td className="px-6 py-3 border text-sm font-medium text-gray-800">
                {user.id}
              </td>
              <td className="px-6 py-3 border text-sm text-gray-700">
                {user.email}
              </td>
              <td className="px-6 py-3 border text-sm text-gray-700">
                {user.username}
              </td>
              <td className="px-6 py-3 border text-sm text-gray-600">
                {user.role || "N/A"}
              </td>
              <td className="px-6 py-3 border text-sm text-gray-500">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-3 border text-sm">
                <button
                  onClick={() => approveUser(user.id)}
                  disabled={approvingId === user.id}
                  className={`px-4 py-2 rounded-md font-semibold transition ${
                    approvingId === user.id
                      ? "bg-yellow-300 cursor-not-allowed"
                      : "bg-yellow-500 hover:bg-yellow-600 text-white"
                  }`}
                >
                  {approvingId === user.id ? "Approving..." : "Approve"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PendingUsers;
