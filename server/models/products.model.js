const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    productType: {
      type: String,
      required: true,
      enum: [
        "Foods",
        "Electronics",
        "Clothes",
        "Beauty Products",
        "Others",
      ],
    },

    quantityStock: {
      type: Number,
      required: true,
      min: 0,
    },

    mrp: {
      type: Number,
      required: true,
      min: 0,
    },

    sellingPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    brandName: {
      type: String,
      trim: true,
    },

    images: {
      type: [String],
      default: [],
    },

    exchangeEligible: {
      type: Boolean,
      default: false,
    },

    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);