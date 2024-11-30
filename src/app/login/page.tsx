"use client";

import Footer from "../components/Footer";
import Header from "../components/Header";
import { authenticateUser } from "../lib/auth";
import { motion } from "framer-motion";
import { Lock, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const LoginPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (authenticateUser(username, password)) {
      localStorage.setItem("authToken", "hardcodedToken"); // Save token to localStorage
      router.push("/admin"); // Redirect to dashboard
    } else {
      setError("Invalid username or password.");
    }
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-bl from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-gray-800 z-0">
        <div className="absolute w-40 h-40 bg-blue-600/20 rounded-full animate-blob top-10 left-20 mix-blend-overlay"></div>
        <div className="absolute w-52 h-52 bg-purple-600/20 rounded-full animate-blob animation-delay-2000 top-1/3 right-20 mix-blend-overlay"></div>
        <div className="absolute w-48 h-48 bg-pink-600/20 rounded-full animate-blob animation-delay-4000 bottom-20 left-1/3 mix-blend-overlay"></div>
      </div>

      {/* Header */}
      <Header />

      {/* Login Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
        >
          <div className="flex justify-center mb-6">
            <Lock
              className="text-blue-500 animate-pulse"
              size={64}
              strokeWidth={1.5}
            />
          </div>

          <h1 className="text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-200 to-blue-300">
            Login
          </h1>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 text-gray-300 rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 text-gray-300 rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-4 py-2 rounded-xl hover:shadow-indigo-500/25 transition-all"
            >
              <LogIn size={18} />
              <span>Login</span>
            </motion.button>
          </form>
        </motion.div>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LoginPage;
