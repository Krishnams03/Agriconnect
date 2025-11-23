// pages/api/discussions/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongodb';
import Discussion from '@/lib/models/Discussion';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'GET') {
    // Fetch all discussions
    try {
      const discussions = await Discussion.find().sort({ createdAt: -1 });
      res.status(200).json(discussions);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch discussions' });
    }
  } else if (req.method === 'POST') {
    // Create a new discussion
    const { title, content, category, author } = req.body;

    try {
      const newDiscussion = new Discussion({
        title,
        content,
        category,
        author,
        createdAt: new Date().toISOString(),
      });

      await newDiscussion.save();
      res.status(201).json(newDiscussion);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create discussion' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}