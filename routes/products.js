const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRoles'); // Ensure file is named checkRole.js
const Product = require('../models/Product');
const upload = require('../middleware/upload');

// =========================================================================
// 1. DENTIST: Create a new product (Files + Links)
// =========================================================================
router.post(
  '/', 
  auth, 
  checkRole(['dentist']), 
  upload.array('briefs', 5),
  async (req, res) => {
    try {
      const { name, brand, description, category, externalLinks } = req.body;
      
      // Handle Uploaded Files
      const fileData = req.files ? req.files.map(file => ({
        fileName: file.originalname,
        filePath: file.path,
        fileType: 'file'
      })) : [];

      // Handle External Links (With Safety Check)
      let linkData = [];
      if (externalLinks) {
        try {
          const parsedLinks = typeof externalLinks === 'string' ? JSON.parse(externalLinks) : externalLinks;
          if (Array.isArray(parsedLinks)) {
            linkData = parsedLinks.map(link => ({
              fileName: link.title || 'External Link',
              filePath: link.url,
              fileType: 'link'
            }));
          }
        } catch (e) {
          console.error("JSON Parse Error:", e.message);
        }
      }

      const allBriefs = [...fileData, ...linkData];

      const newProduct = new Product({
        name,
        brand,
        description,
        category,
        createdBy: req.user.id,
        briefs: allBriefs,
        status: 'new'
      });

      const product = await newProduct.save();
      res.json(product);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// =========================================================================
// 2. DESIGNER: Upload Designs
// =========================================================================
router.post(
  '/:id/designs',
  auth,
  checkRole(['designer']),
  upload.array('finalDesigns', 5),
  async (req, res) => {
    try {
      let product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ msg: 'Product not found' });

      const designFiles = req.files.map(file => ({
        fileName: file.originalname,
        filePath: file.path,
        uploadedBy: req.user.id,
        uploadedAt: Date.now()
      }));

      product.finalDesigns.push(...designFiles);
      product.status = 'pending_approval'; 

      await product.save();
      res.json(product);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// =========================================================================
// 3. EVERYONE: Get All Products (Search, Filter, Pagination)
// =========================================================================
router.get('/', auth, async (req, res) => {
    try {
        // Added page and limit for Pagination
        const { status, search, brand, page = 1, limit = 10 } = req.query;
        
        let query = {};

        if (status) query.status = status;
        if (brand) query.brand = brand;
        if (search) query.name = { $regex: search, $options: 'i' };

        const products = await Product.find(query)
            .populate('createdBy', 'username')
            .sort({ createdAt: -1 })
            .limit(limit * 1)        // Pagination Logic
            .skip((page - 1) * limit) // Pagination Logic
            .exec();

        const count = await Product.countDocuments(query);

        res.json({
            products,
            totalPages: Math.ceil(count / limit),
            currentPage: Number(page)
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// =========================================================================
// 4. EVERYONE: Get Single Product by ID
// =========================================================================
router.get('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('createdBy', 'username email')
      .populate('finalDesigns.uploadedBy', 'username');

    if (!product) return res.status(404).json({ msg: 'Product not found' });

    res.json(product);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Product not found' });
    res.status(500).send('Server Error');
  }
});

// =========================================================================
// 5. DENTIST: Approve/Reject Design
// =========================================================================
router.put('/:id/status', auth, checkRole(['dentist']), async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;

    const validStatuses = ['approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ msg: "Invalid status" });
    }

    let product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: 'Product not found' });

    product.status = status;

    // Handle Rejection Reason
    if (status === 'rejected') {
      product.rejectionReason = rejectionReason || "No reason provided";
    } else {
      product.rejectionReason = ""; // Clear if approved
    }

    await product.save();
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;