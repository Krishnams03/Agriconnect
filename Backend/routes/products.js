const express = require('express');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Add a new product
router.post('/', auth, async (req, res) => {
  try {
    const { name, type, price, unit, quantity } = req.body;
    const newProduct = new Product({
      name,
      type,
      price,
      unit,
      quantity,
      seller: req.user.id,
    });

    const product = await newProduct.save();
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update a product
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, type, price, unit, quantity } = req.body;
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.seller.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, type, price, unit, quantity },
      { new: true }
    );

    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete a product
router.delete('/:id', auth, async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.seller.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Product.findByIdAndRemove(req.params.id);

    res.json({ message: 'Product removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;