"use client";

import { Post } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { motion } from "framer-motion";

interface PostListProps {
  posts: Post[];
  isLoading: boolean;
}

export function PostList({ posts, isLoading }: PostListProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-green-800">Recent Discussions</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <ul className="space-y-4">
            {posts?.map((post) => (
              <motion.li
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-b pb-4 last:border-b-0"
              >
                <h3 className="text-lg font-medium text-green-700">{post.title}</h3>
                <p className="text-sm text-gray-600">
                  Started by {post.author.name}, {format(new Date(post.createdAt), 'PP')}
                </p>
                <div className="flex space-x-2 text-sm text-gray-500">
                  <span className="bg-green-200 px-2 py-1 rounded-full">{post.category}</span>
                  {post.tags.map((tag, idx) => (
                    <span key={idx} className="bg-gray-200 px-2 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}