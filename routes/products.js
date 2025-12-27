const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');
const Product = require('../models/Product');
const upload = require('../middleware/upload');

// @route   POST /api/products
// @desc    Create a new product with brief files
// @access  Private (Dentist only)
router.post(
  '/', 
  auth, 
  checkRole(['dentist']), 
  upload.array('briefs', 5), // 'briefs' is the field name, max 5 files
  async (req, res) => {
    try {
      const { name, brand, description, category } = req.body;

      // Map uploaded files to our schema format
      // If no files were uploaded, 'req.files' will be empty
      const briefsData = req.files ? req.files.map(file => ({
        fileName: file.originalname,
        filePath: file.path // This is the Cloudinary URL
      })) : [];

      const newProduct = new Product({
        name,
        brand,
        description,
        category,
        createdBy: req.user.id,
        briefs: briefsData
      });

      const product = await newProduct.save();
      res.json(product);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET /api/products
// @desc    Get all products
// @access  Private (Everyone)
router.get('/', auth, async (req, res) => {
    try {
        const products = await Product.find().populate('createdBy', 'username');
        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;