const mongoose = require('mongoose');

const CustomizeTextSchema = new mongoose.Schema({
    id: String,
    content: String,
    font: String,
    color: String,
    size: Number,
    x: Number,
    y: Number
});

const CustomizeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Can be anonymous or stored against a session ID if needed, but for now we'll allow unauthenticated saves or handle auth in controller
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    designImage: {
        type: String, // Front Design Image
        required: true
    },
    backDesignImage: {
        type: String, // Back Design Image (Optional)
        required: false
    },
    texts: [CustomizeTextSchema], // Front texts
    backTexts: [CustomizeTextSchema], // Back texts
    logo: { // Front Logo
        preview: String,
        x: Number,
        y: Number,
        size: Number
    },
    backLogo: { // Back Logo
        preview: String,
        x: Number,
        y: Number,
        size: Number
    },
    basePrice: Number,
    finalPrice: Number,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Customize', CustomizeSchema);
