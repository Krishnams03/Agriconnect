// db.js
const mongoose = require('mongoose');

// MongoDB URI
const mongoURI = 'mongodb://localhost:27017/agriconnect'; // Change to your MongoDB URI

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected successfully!');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
