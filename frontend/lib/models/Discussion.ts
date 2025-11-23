import mongoose, { Schema, Document, Model } from 'mongoose';

export interface DiscussionDocument extends Document {
  title: string;
  content: string;
  category: 'crops' | 'fertilizers' | 'diseases' | 'weather' | 'market' | 'general';
  tags?: string[];
  author: mongoose.Types.ObjectId;
  authorName: string;
  date: Date;
  likes: mongoose.Types.ObjectId[];
  replies: Array<{
    content: string;
    author?: mongoose.Types.ObjectId;
    authorName?: string;
    date: Date;
  }>;
  isActive: boolean;
}

const discussionSchema = new Schema<DiscussionDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['crops', 'fertilizers', 'diseases', 'weather', 'market', 'general'],
    },
    tags: [
      {
        type: String,
        trim: true,
        maxlength: 50,
      },
    ],
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    authorName: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    replies: [
      {
        content: String,
        author: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
        authorName: String,
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

discussionSchema.index({ title: 'text', content: 'text', tags: 'text' });
discussionSchema.index({ category: 1, date: -1 });

const Discussion: Model<DiscussionDocument> =
  mongoose.models.Discussion || mongoose.model<DiscussionDocument>('Discussion', discussionSchema);

export default Discussion;
