// models/Discussion.js
const mongoose = require('mongoose');

const discussionSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 200
  },
  content: { 
    type: String, 
    required: true,
    trim: true
  },
  category: { 
    type: String, 
    required: true,
    enum: ['crops', 'fertilizers', 'diseases', 'weather', 'market', 'general']
  },
  tags: [{ 
    type: String,
    trim: true,
    maxlength: 50
  }],
  author: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  date: { 
    type: Date, 
    default: Date.now 
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  replies: [{
    content: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    authorName: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
});

// Add indexes for better search performance
discussionSchema.index({ title: 'text', content: 'text', tags: 'text' });
discussionSchema.index({ category: 1, date: -1 });

module.exports = mongoose.model('Discussion', discussionSchema);