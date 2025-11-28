"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";

interface PostFormProps {
  onPostCreated: () => void;
}

export function PostForm({ onPostCreated }: PostFormProps) {
  const { data: session } = useSession();
  const [newDiscussion, setNewDiscussion] = useState({
    title: "",
    content: "",
    category: "",
    tags: [] as string[]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      alert("Please sign in to create a post");
      return;
    }

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDiscussion),
      });

      if (!response.ok) throw new Error("Failed to create post");

      setNewDiscussion({ title: "", content: "", category: "", tags: [] });
      onPostCreated();
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again.");
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-green-800">Start a New Discussion</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Discussion Title"
            value={newDiscussion.title}
            onChange={(e) => setNewDiscussion({ ...newDiscussion, title: e.target.value })}
            required
          />
          <Textarea
            placeholder="What's on your mind?"
            rows={4}
            value={newDiscussion.content}
            onChange={(e) => setNewDiscussion({ ...newDiscussion, content: e.target.value })}
            required
          />
          <Input
            placeholder="Category (e.g., Organic Farming)"
            value={newDiscussion.category}
            onChange={(e) => setNewDiscussion({ ...newDiscussion, category: e.target.value })}
            required
          />
          <div className="flex space-x-2">
            <Input
              placeholder="Tag (e.g., soil health)"
              value={newDiscussion.tags[0] || ""}
              onChange={(e) => setNewDiscussion({ ...newDiscussion, tags: [e.target.value] })}
            />
            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={!session}
            >
              {session ? "Post Discussion" : "Sign in to Post"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}