"use client";

import { useState, useEffect } from "react";
import { getUserSession, updateUserSession, deleteUserAccount } from "@/app/utils/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";  // Assuming AgriConnect's Button component
import Link from "next/link";
import { motion } from "framer-motion";
import { Leaf, Menu } from "lucide-react"; // Assuming icons are used for the navbar
import "@/app/globals.css";  // Assuming AgriConnect's global styles are imported

export default function AccountDetails() {
  const [user, setUser] = useState<{ username: string; email: string; password: string; confirmPassword: string } | null>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  // Fetch user data on page load
  useEffect(() => {
    const session = getUserSession();
    if (session) {
      const sessionUsername = session.username ?? "";
      const sessionEmail = session.email ?? "";
      setUser({
        username: sessionUsername,
        email: sessionEmail,
        password: "",
        confirmPassword: "",
      });
      setFormData({
        username: sessionUsername,
        email: sessionEmail,
        password: "",
        confirmPassword: "",
      });
    } else {
      router.push("/"); // Redirect to home if no session
    }
  }, [router]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle saving updates
  const handleSave = () => {
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const updatedData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
    };

    updateUserSession(updatedData);
    setUser({
      username: formData.username,
      email: formData.email,
      password: "",
      confirmPassword: "",
    });
    setEditing(false);
    alert("Account details updated successfully!");
  };

  // Handle account deletion
  const handleDelete = () => {
    const confirmDelete = confirm("Are you sure you want to delete your account?");
    if (confirmDelete) {
      deleteUserAccount();
      router.push("/");
      alert("Your account has been deleted.");
    }
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen flex flex-col"
    >
      {/* Background Video */}
      <video
        className="absolute inset-0 object-cover w-full h-full opacity-90"
        src="/assets/videos/bg.mp4" // Replace with your actual video path
        autoPlay
        loop
        muted
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>

      {/* Navbar */}
      <motion.header
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 30 }}
        className="fixed w-full top-0 z-50 backdrop-filter backdrop-blur-sm bg-transparent"
      >
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold flex items-center text-white">
            <Leaf className="mr-2" />
            AgriConnect
          </Link>
          <div className="hidden md:flex items-center space-x-5">
            <Link href="/" className="hover:text-green-300 text-white">
              Home
            </Link>
            
          </div>
          <div className="md:hidden">
            <Menu
              className="h-8 w-8 text-white"
              onClick={toggleMobileMenu}
            />
          </div>
        </nav>
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black bg-opacity-50 text-white p-4"
          >
            <Link href="/" className="block mb-6 hover:text-green-300">
              Home
            </Link>
            
          </motion.div>
        )}
      </motion.header>

      {/* Account Details Content */}
      <div className="relative flex-grow flex items-center justify-center py-16 z-10">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md bg-white bg-opacity-30 backdrop-blur-md p-8 rounded-lg shadow-lg"
        >
          <h1 className="text-3xl font-bold text-green-800 text-center mb-6">
            Account Details
          </h1>
          {user ? (
            <div className="space-y-6">
              {/* View Mode */}
              {!editing ? (
                <div className="space-y-4">
                  <p className="text-lg">
                    <strong className="text-white">Username:</strong> {user.username}
                  </p>
                  <p className="text-lg">
                    <strong className="text-white">Email:</strong> {user.email}
                  </p>
                  <div className="space-x-4">
                    <Button onClick={() => setEditing(true)} className="bg-blue-600 text-white hover:bg-blue-700">
                      Edit
                    </Button>
                    <Button onClick={handleDelete} className="bg-red-600 text-white hover:bg-red-700">
                      Delete Account
                    </Button>
                  </div>
                </div>
              ) : (
                /* Edit Mode */
                <div className="space-y-4">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-200">
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="Enter your username"
                      aria-label="Username"
                      className="mt-2 block w-full rounded-lg border border-gray-300 bg-gray-100 text-gray-700 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none py-3 px-4"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      aria-label="Email"
                      className="mt-2 block w-full rounded-lg border border-gray-300 bg-gray-100 text-gray-700 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none py-3 px-4"
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-200">
                      New Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your new password"
                      aria-label="Password"
                      className="mt-2 block w-full rounded-lg border border-gray-300 bg-gray-100 text-gray-700 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none py-3 px-4"
                    />
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your new password"
                      aria-label="Confirm Password"
                      className="mt-2 block w-full rounded-lg border border-gray-300 bg-gray-100 text-gray-700 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none py-3 px-4"
                    />
                  </div>
                  <div className="space-x-4">
                    <Button onClick={handleSave} className="w-full py-3 bg-green-800 text-white hover:bg-green-600">
                      Save
                    </Button>
                    <Button onClick={() => setEditing(false)} className="w-full py-3 bg-gray-500 text-white hover:bg-gray-600">
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-center text-white">Loading account details...</p>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
