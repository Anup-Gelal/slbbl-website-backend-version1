
import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminLogPanel = () => {
  const [logs, setLogs] = useState([]);
  const [logType, setLogType] = useState("login"); // login | admin
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [userID, setUserID] = useState("");

  const BASE_URL = "http://localhost:8080/api/v1/admin";

  const fetchLogs = async () => {
    try {
      const params = {};
      if (start && end) {
        params.start = start;
        params.end = end;
      }
      if (userID) {
        params[logType === "login" ? "user_id" : "admin_id"] = userID;
      }

      const res = await axios.get(
        `${BASE_URL}/${logType}-logs`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          params,
        }
      );
      setLogs(res.data.logs || []);
    } catch (err) {
      console.error("Failed to fetch logs", err);
    }
  };

  const exportCSV = () => {
    const query = new URLSearchParams();
    if (start && end) {
      query.append("start", start);
      query.append("end", end);
    }
    if (userID) {
      query.append(logType === "login" ? "user_id" : "admin_id", userID);
    }

    window.open(`${BASE_URL}/${logType}-logs/csv?${query.toString()}`, "_blank");
  };

  useEffect(() => {
    fetchLogs();
  }, [logType]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Admin Logs</h2>

      <div className="flex flex-wrap gap-4 mb-4">
        <select
          value={logType}
          onChange={(e) => setLogType(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="login">Login Logs</option>
          <option value="admin">Admin Action Logs</option>
        </select>

        <input
          type="text"
          placeholder={logType === "login" ? "User ID" : "Admin ID"}
          className="border px-3 py-2 rounded"
          value={userID}
          onChange={(e) => setUserID(e.target.value)}
        />

        <input
          type="date"
          className="border px-3 py-2 rounded"
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />
        <input
          type="date"
          className="border px-3 py-2 rounded"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
        />

        <button
          onClick={fetchLogs}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Filter
        </button>

        <button
          onClick={exportCSV}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto mt-4">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {logType === "login" ? (
                <>
                  <th className="px-4 py-2 text-left border">User ID</th>
                  <th className="px-4 py-2 text-left border">Timestamp</th>
                  <th className="px-4 py-2 text-left border">IP</th>
                </>
              ) : (
                <>
                  <th className="px-4 py-2 text-left border">Admin ID</th>
                  <th className="px-4 py-2 text-left border">Action</th>
                  <th className="px-4 py-2 text-left border">Target ID</th>
                  <th className="px-4 py-2 text-left border">Timestamp</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td className="px-4 py-2 border text-center" colSpan={logType === "login" ? 3 : 4}>
                  No logs found
                </td>
              </tr>
            ) : (
              logs.map((log, idx) => (
                <tr key={idx}>
                  {logType === "login" ? (
                    <>
                      <td className="px-4 py-2 border">{log.user_id}</td>
                      <td className="px-4 py-2 border">{log.timestamp}</td>
                      <td className="px-4 py-2 border">{log.ip}</td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-2 border">{log.admin_id}</td>
                      <td className="px-4 py-2 border">{log.action}</td>
                      <td className="px-4 py-2 border">{log.target_id}</td>
                      <td className="px-4 py-2 border">{log.timestamp}</td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminLogPanel;
