import mongoose from "mongoose";

const ProductsSchema = mongoose.Schema({
  productName: {
    type: String,
    required: [true, "product name is required"],
  },
  productBrand: {
    type: String,
    required: [true, "Product Brand is required"],
  },
  productImages: {
    type: [string],
    validate: {
      validator: function (imageArray) {
        return imageArray.length <= 4;
      },
      message: "Four Image scan be added",
    },
  },
  stocks: [
    {
      size: {
        type: String,
        require: true,
        enum: ["S", "M", "L", "XL", "XXL"],
      },
      quantity: {
        type: Number,
        require: true,
        min: [0, "Quantity cannot be negative"],
      },
    },
  ],
  productPrice: {
    type: Number,
    required: true,
  },
  offer: {
    type: Number,
  },
  deliveredAt: {
    type: Number,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  modifiedAt: {
    type: Date,
    default: Date.now,
  },
});

ProductsSchema.pre("save", function (next) {
  this.modifiedAt = Date.now();
  next();
});

export const Products = mongoose.model("products", ProductsSchema);
