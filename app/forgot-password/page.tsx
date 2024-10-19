"use client"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Leaf } from "lucide-react";
import { useState } from "react";

export default function ForgotPassword() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex flex-col bg-green-50">
      {/* Navbar */}
      <header className="bg-green-800 text-white w-full">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold flex items-center">
              <Leaf className="mr-2" />
              AgriConnect
            </Link>
            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden text-white focus:outline-none"
            >
              {isMobileMenuOpen ? "✖" : "☰"} {/* Hamburger or close icon */}
            </button>

            {/* Desktop menu */}
            <div className="hidden md:flex space-x-4">
              <button className="hover:text-green-300">
                <Link href="/">Home</Link>
              </button>
            
              <Button variant="outline" className="bg-green-700 text-white hover:bg-green-600">
              <Link href="/sign-up">Sign Up</Link>
            </Button>
            </div>
            
            
          </div>

          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <div className="mt-2 md:hidden bg-green-700 rounded-md">
              <div className="flex flex-col space-y-2 px-4 py-2">
                <Link href="/" className="text-white hover:text-green-300">Home</Link>
                <Link href="/sign-up" className="text-white hover:text-green-300">Sign Up</Link>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Reset Password Form */}
      <div className="flex items-center justify-center flex-1">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-green-800 text-center mb-6">Reset Password</h1>
          <p className="text-gray-600 text-center mb-6">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
          <form className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
              Send Reset Link
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Remember your password?{" "}
            <Link href="/log-in" className="text-green-600 hover:underline">
              Log in here
            </Link>.
          </p>
        </div>
      </div>
      <footer className="bg-green-800 text-white py-4">
        <div className="container mx-auto text-center">
          &copy; 2024 AgriConnect. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
