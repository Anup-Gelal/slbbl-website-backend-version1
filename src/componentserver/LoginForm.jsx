import React, { useState } from "react";
import { motion } from "framer-motion";

const fadeInVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const LoginForm = ({ view, setView, onLogin, onRegister, message }) => {
  const [userID, setuserID] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (view === "login") {
      onLogin(userID.trim(), password);
    } else {
      onRegister(userID.trim(), username.trim(), password);
    }
  };

  return (
    <motion.div
      className="max-w-md mx-auto p-6 bg-white rounded shadow mt-10"
      variants={fadeInVariants}
      initial="hidden"
      animate="visible"
    >
      <h2 className="text-2xl font-semibold mb-6 text-green-600">
        {view === "login" ? "Login" : "Register"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="userID"
          placeholder="userID"
          required
          value={userID}
          onChange={(e) => setuserID(e.target.value)}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
        />
        {view === "register" && (
          <input
            type="text"
            placeholder="Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          />
        )}
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
        />
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
        >
          {view === "login" ? "Login" : "Register"}
        </button>
      </form>

      {message && <p className="text-red-500 mt-4">{message}</p>}

      <p className="mt-6 text-center text-sm text-gray-600">
        {view === "login" ? (
          <>
            Don’t have an account?{" "}
            <button
              onClick={() => setView("register")}
              className="text-green-600 hover:underline"
              type="button"
            >
              Register here
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button
              onClick={() => setView("login")}
              className="text-green-600 hover:underline"
              type="button"
            >
              Login here
            </button>
          </>
        )}
      </p>
    </motion.div>
  );
};

export default LoginForm;
