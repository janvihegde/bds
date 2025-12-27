const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');
const Product = require('../models/Product'); // Ensure you created the Product Model earlier

// DENTIST ONLY: Create Product
router.post('/', auth, checkRole(['dentist']), async (req, res) => {
    try {
        const newProduct = new Product({
            ...req.body,
            createdBy: req.user.id
        });
        const product = await newProduct.save();
        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// EVERYONE: Get All Products
router.get('/', auth, async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;