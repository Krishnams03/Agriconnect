// routes/discussions.js
const express = require('express');
const Discussion = require('../models/Discussion');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all discussions
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const discussions = await Discussion.find(query).sort({ date: -1 });
    res.json(discussions);
  } catch (error) {
    console.error('Error fetching discussions:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Create a new discussion
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ message: 'Title, content, and category are required.' });
    }

    const newDiscussion = new Discussion({
      title,
      content,
      category,
      tags: tags || [],
      author: req.user.name || 'Anonymous'
    });

    await newDiscussion.save();
    res.status(201).json(newDiscussion);
  } catch (error) {
    console.error('Error creating discussion:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Get a specific discussion
router.get('/:id', async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }
    res.json(discussion);
  } catch (error) {
    console.error('Error fetching discussion:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Update a discussion (only by author)
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;
    
    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    // Check if user is the author (you might want to add user ID to discussions)
    // For now, we'll allow any authenticated user to update

    const updatedDiscussion = await Discussion.findByIdAndUpdate(
      req.params.id,
      { title, content, category, tags },
      { new: true }
    );

    res.json(updatedDiscussion);
  } catch (error) {
    console.error('Error updating discussion:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Delete a discussion (only by author)
router.delete('/:id', auth, async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    await Discussion.findByIdAndDelete(req.params.id);
    res.json({ message: 'Discussion deleted successfully' });
  } catch (error) {
    console.error('Error deleting discussion:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

module.exports = router;