const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  type: { 
    type: String, 
    enum: ['crop', 'fertilizer'], 
    required: true 
  },
  price: { 
    type: Number, 
    required: true,
    min: 0
  },
  unit: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 50
  },
  quantity: { 
    type: Number, 
    required: true,
    min: 0
  },
  seller: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  images: [{
    type: String // URLs to product images
  }],
  category: {
    type: String,
    trim: true,
    maxlength: 100
  },
  location: {
    city: String,
    state: String,
    country: { type: String, default: 'India' }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  ratings: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 50
  }]
}, {
  timestamps: true // This adds createdAt and updatedAt fields
});

// Index for better search performance
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ type: 1, isActive: 1, createdAt: -1 });
productSchema.index({ seller: 1, createdAt: -1 });
productSchema.index({ price: 1 });

module.exports = mongoose.model('Product', productSchema);