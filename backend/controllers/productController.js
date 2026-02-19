const Product = require('../models/Product');

/* ================= GET ALL PRODUCTS ================= */
const getProducts = async (req, res) => {
    try {
        const { category } = req.query;

        const filter = {};
        if (category && category !== "all") {
            filter.category = category;
        }

        const products = await Product.find(filter).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            products,
        });
    } catch (error) {
        console.error("Fetch products error:", error);
        res.status(500).json({ error: "Failed to fetch products" });
    }
};

/* ================= GET SINGLE PRODUCT ================= */
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.status(200).json({
            success: true,
            product,
        });
    } catch (error) {
        console.error("Fetch product error:", error);
        res.status(500).json({ error: "Failed to fetch product" });
    }
};

/* ================= CREATE PRODUCT ================= */
const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);

        // ✅ FIXED STATUS CODE
        res.status(201).json({
            success: true,
            product,
        });
    } catch (error) {
        console.error("Create product error:", error);
        res.status(500).json({ error: "Failed to create product" });
    }
};

/* ================= UPDATE PRODUCT ================= */
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.status(200).json({
            success: true,
            product,
        });
    } catch (error) {
        console.error("Update product error:", error);
        res.status(500).json({ error: "Failed to update product" });
    }
};

/* ================= DELETE PRODUCT ================= */
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        });
    } catch (error) {
        console.error("Delete product error:", error);
        res.status(500).json({ error: "Failed to delete product" });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
