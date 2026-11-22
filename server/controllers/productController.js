const Product = require("../models/Product");

// GET /api/products
exports.getProducts = async (req, res) => {
  try {
    const { category, gender, search } = req.query;

    const filter = { isActive: true };

    if (category) filter.category = category.toLowerCase();
    if (gender) filter.gender = gender.toLowerCase();

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    const products = await Product.find(filter).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve products",
    });
  }
};

// GET /api/products/:id
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      isActive: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid product ID",
    });
  }
};

// POST /api/products
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      gender,
      price,
      imageUrl,
      tryOnImageUrl,
    } = req.body;

    const product = await Product.create({
      name,
      description,
      category,
      gender,
      price,
      imageUrl,
      tryOnImageUrl,
    });

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};