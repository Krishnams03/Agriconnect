const express = require('express');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all products with filtering and search
router.get('/', async (req, res) => {
  try {
    const { type, search, minPrice, maxPrice, page = 1, limit = 20 } = req.query;
    
    let query = {};
    
    // Filter by type
    if (type && ['crop', 'fertilizer'].includes(type)) {
      query.type = type;
    }
    
    // Search functionality
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Only show products with quantity > 0
    query.quantity = { $gt: 0 };

    const skip = (page - 1) * limit;
    
    const products = await Product.find(query)
      .populate('seller', 'name email')
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      products,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalProducts: total,
        hasNext: skip + products.length < total,
        hasPrev: page > 1
      }
    });
  } catch (err) {
    console.error('Error fetching products:', err.message);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching products',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Get products by current user
router.get('/my/products', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const products = await Product.find({ seller: req.user.userId })
      .populate('seller', 'name email')
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments({ seller: req.user.userId });

    res.json({
      success: true,
      products,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalProducts: total,
        hasNext: skip + products.length < total,
        hasPrev: page > 1
      }
    });
  } catch (err) {
    console.error('Error fetching user products:', err.message);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching your products',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Get a single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'name email');
    
    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }

    res.json({
      success: true,
      product
    });
  } catch (err) {
    console.error('Error fetching product:', err.message);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching product',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Add a new product
router.post('/', auth, async (req, res) => {
  try {
    const { name, type, price, unit, quantity, description } = req.body;

    // Validation
    if (!name || !type || !price || !unit || quantity === undefined) {
      return res.status(400).json({ 
        success: false,
        message: 'All fields are required',
        requiredFields: ['name', 'type', 'price', 'unit', 'quantity']
      });
    }

    if (!['crop', 'fertilizer'].includes(type)) {
      return res.status(400).json({ 
        success: false,
        message: 'Product type must be either "crop" or "fertilizer"'
      });
    }

    if (price <= 0 || quantity < 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Price must be greater than 0 and quantity must be non-negative'
      });
    }

    const newProduct = new Product({
      name: name.trim(),
      type,
      price: Number(price),
      unit: unit.trim(),
      quantity: Number(quantity),
      description: description ? description.trim() : '',
      seller: req.user.userId,
    });

    const product = await newProduct.save();
    const populatedProduct = await Product.findById(product._id).populate('seller', 'name email');

    res.status(201).json({
      success: true,
      message: 'Product added successfully',
      product: populatedProduct
    });
  } catch (err) {
    console.error('Error adding product:', err.message);
    res.status(500).json({ 
      success: false,
      message: 'Error adding product',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Update a product
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, type, price, unit, quantity, description } = req.body;
    
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }

    if (product.seller.toString() !== req.user.userId) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to update this product' 
      });
    }

    // Validation
    if (type && !['crop', 'fertilizer'].includes(type)) {
      return res.status(400).json({ 
        success: false,
        message: 'Product type must be either "crop" or "fertilizer"'
      });
    }

    if (price && price <= 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Price must be greater than 0'
      });
    }

    if (quantity !== undefined && quantity < 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Quantity must be non-negative'
      });
    }

    // Update fields
    const updateData = {};
    if (name) updateData.name = name.trim();
    if (type) updateData.type = type;
    if (price) updateData.price = Number(price);
    if (unit) updateData.unit = unit.trim();
    if (quantity !== undefined) updateData.quantity = Number(quantity);
    if (description !== undefined) updateData.description = description.trim();
    updateData.updatedAt = new Date();

    product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('seller', 'name email');

    res.json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (err) {
    console.error('Error updating product:', err.message);
    res.status(500).json({ 
      success: false,
      message: 'Error updating product',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Delete a product
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }

    if (product.seller.toString() !== req.user.userId) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to delete this product' 
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting product:', err.message);
    res.status(500).json({ 
      success: false,
      message: 'Error deleting product',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

module.exports = router;