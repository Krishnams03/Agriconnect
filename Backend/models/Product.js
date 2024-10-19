const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['crop', 'fertilizer'], required: true },
  price: { type: Number, required: true },
  unit: { type: String, required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quantity: { type: Number, required: true },
});

module.exports = mongoose.model('Product', productSchema);