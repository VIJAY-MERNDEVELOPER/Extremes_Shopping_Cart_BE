import mongoose from "mongoose";
import { Products } from "./productModel.js";

export const addressSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
    default: "India",
  },
  pincode: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
});

export const cartSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Products",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  size: {
    type: String,
    required: true,
  },
});

export const wishListSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Products",
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

export const orderSchema = new mongoose.Schema(
  {
    orderItems: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: Products,
          required: true,
        },

        size: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        productPrice: {
          type: Number,
          required: true,
        },
        discountPercentage: {
          type: Number,
          required: true,
        },
        deliveryDate: {
          type: Date,
          default: function () {
            // Calculate delivery date 5 days after orderDate
            return new Date(
              this.parent().orderDate.getTime() + 5 * 24 * 60 * 60 * 1000
            );
          },
        },
        _id: false,
      },
    ],
    totalItems: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    totalDiscount: {
      type: Number,
      required: true,
    },
    orderDate: {
      type: Date,
      default: Date.now(),
    },
    shippingAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "addressSchema",
    },
    orderStatus: {
      type: String,
      enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    paymentDetails: {
      paymentMethod: {
        type: String,
      },
      transactionId: {
        type: String,
      },
      paymentId: {
        type: String,
      },
      paymentStatus: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending",
      },
    },
    isCancelled: {
      type: Boolean,
      default: false,
    },
    cancellationReason: {
      type: String,
    },
    cancelledBy: {
      type: String,
    },
    canecllationDate: {
      type: Date,
    },
  },
  { strict: false }
);

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 8,
    max: 12,
  },
  role: {
    type: String,
    default: "user",
  },
  cart: {
    type: [cartSchema],
  },
  wishlist: {
    type: [wishListSchema],
  },
  order: {
    type: [orderSchema],
  },
  address: {
    type: [addressSchema],
  },
  paymentMethod: {
    type: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", function (next) {
  this.createdAt = Date.now();
  next();
});

/* 
creates a Mongoose model named User, 
which corresponds to the "users" collection in your MongoDB database,
 and enforces the schema defined by userSchema
 */

export const User = mongoose.model("users", userSchema);
