const Order = require('../models/Order');

// @desc    Get all orders (Admin gets all, user gets their own)
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res) => {
    try {
        const filter = req.user.role === "admin" ? {} : { user: req.user._id };

        const orders = await Order.find(filter)
            .populate("user", "name email")
            .populate({
                path: "items.product",
                select: "name category basePrice images",
            })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            orders,
        });
    } catch (error) {
        console.error("Fetch orders error:", error);
        res.status(500).json({ error: "Failed to fetch orders" });
    }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("user", "name email phone")
            .populate("items.product");

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        if (req.user.role !== "admin" && order.user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "Unauthorized access to this order" });
        }

        res.json({
            success: true,
            order,
        });
    } catch (error) {
        console.error("Fetch order error:", error);
        res.status(500).json({ error: "Failed to fetch order" });
    }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
    try {
        const orderNumber = "ORD-" + Date.now() + "-" + Math.floor(Math.random() * 1000);

        const order = await Order.create({
            ...req.body,
            orderNumber,
            user: req.user._id,
        });

        const populatedOrder = await Order.findById(order._id)
            .populate("user", "name email")
            .populate({
                path: "items.product",
                select: "name category basePrice images",
            });

        res.status(201).json({
            success: true,
            order: populatedOrder,
        });
    } catch (error) {
        console.error("Create order error:", error);
        res.status(500).json({ error: "Failed to create order" });
    }
};

// @desc    Update order status
// @route   PATCH /api/orders/:id
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status, updatedAt: new Date() },
            { new: true }
        )
            .populate("user", "name email")
            .populate("items.product");

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        res.json({
            success: true,
            order,
        });
    } catch (error) {
        console.error("Update order error:", error);
        res.status(500).json({ error: "Failed to update order" });
    }
};

module.exports = {
    getOrders,
    getOrderById,
    createOrder,
    updateOrderStatus,
};
