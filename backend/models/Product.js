const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  category: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  basePrice: {
    type: Number,
    required: true,
  },

  images: {
    front: {
      type: String,
      required: true,
    },
    back: {
      type: String,
      required: false,
    },
  },

  customizationOptions: {
    allowText: {
      type: Boolean,
      default: true,
    },
    allowImage: {
      type: Boolean,
      default: true,
    },
    allowColor: {
      type: Boolean,
      default: false,
    },
    sizes: [
      {
        name: String,
        priceModifier: {
          type: Number,
          default: 0,
        },
      },
    ],
    colors: [
      {
        name: String,
        hexCode: String,
        priceModifier: {
          type: Number,
          default: 0,
        },
      },
    ],
  },

  stock: {
    type: Number,
    default: 0,
  },

  isActive: {
    type: Boolean,
    default: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", ProductSchema);
