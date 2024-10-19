"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {Leaf,Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

export default function CommunityForumPage() {
  const [discussions, setDiscussions] = useState([
    { title: "Best practices for organic farming", author: "JohnDoe", date: "2 days ago" },
    { title: "Dealing with tomato blight", author: "GreenThumb", date: "1 week ago" },
    { title: "Water conservation techniques for small farms", author: "EcoFarmer", date: "3 days ago" },
  ]);

  const [newDiscussion, setNewDiscussion] = useState({ title: "", content: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDiscussions([
      { title: newDiscussion.title, author: "CurrentUser", date: "Just now" },
      ...discussions,
    ]);
    setNewDiscussion({ title: "", content: "" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-green-50">
      {/* Navbar */}
      <header className="bg-green-800 text-white">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold flex items-center">
          <Leaf className="mr-2" />
            AgriConnect
          </Link>
          <div className="space-x-4 hidden md:flex">
            <Link href="/" className="hover:text-green-300">
              Home
            </Link>
            <Link href="/about" className="hover:text-green-300">
              About
            </Link>
            <Link href="/features" className="hover:text-green-300">
              Features
            </Link>
            <Link href="/contact" className="hover:text-green-300">
              Contact Us
            </Link>
          </div>
          <Button
            variant="outline"
            className="bg-green-700 text-white hover:bg-green-600"
          >
            Sign Up
          </Button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 flex-grow">
        <h1 className="text-4xl font-bold mb-8 text-green-800 text-center">
          Community Forum
        </h1>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Discussions */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-green-800">
                Recent Discussions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {discussions.map((discussion, index) => (
                  <li key={index} className="border-b pb-4 last:border-b-0">
                    <h3 className="text-lg font-medium text-green-700">
                      {discussion.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Started by {discussion.author}, {discussion.date}
                    </p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Start a New Discussion */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-green-800">
                Start a New Discussion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  placeholder="Discussion Title"
                  value={newDiscussion.title}
                  onChange={(e) =>
                    setNewDiscussion({
                      ...newDiscussion,
                      title: e.target.value,
                    })
                  }
                  required
                />
                <Textarea
                  placeholder="What's on your mind?"
                  rows={4}
                  value={newDiscussion.content}
                  onChange={(e) =>
                    setNewDiscussion({
                      ...newDiscussion,
                      content: e.target.value,
                    })
                  }
                  required
                />
                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Post Discussion
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-green-600 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-green-800 text-white py-6">
        <div className="container mx-auto flex flex-col items-center space-y-4">
          <div className="flex space-x-6">
            <div className="flex items-center">
            <Mail className="h-6 w-6 mr-2" />
              <span>contact@agriconnect.com</span>
            </div>
            <div className="flex items-center">
            <Phone className="h-6 w-6 mr-2" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center">
            <MapPin className="h-6 w-6 mr-2" />
              <span>123 Farm Road, Agriville, AG 12345</span>
            </div>
          </div>
          <p className="text-sm">&copy; 2024 AgriConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
