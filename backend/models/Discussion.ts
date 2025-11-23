// models/Discussion.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IDiscussion extends Document {
  title: string;
  content: string;
  category: string;
  author: string;
  createdAt: string;
}

const DiscussionSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true },
    author: { type: String, required: true },
    createdAt: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Discussion = mongoose.models.Discussion || mongoose.model<IDiscussion>('Discussion', DiscussionSchema);

export default Discussion;