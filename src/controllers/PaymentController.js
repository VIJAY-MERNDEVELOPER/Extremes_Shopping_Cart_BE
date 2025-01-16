import { razorpayInstance } from "../config/razorpayClient.js";
import crypto from "crypto";
import { findOrderById } from "./orderController.js";
import { getUser } from "./userController.js";
import { error } from "console";
import { User } from "../model/userModel.js";

const creatOrder = async (options) => {

  const orderData = await razorpayInstance.orders.create(options);
  console.log(orderData);
  return orderData;

  //     const user = await getUser(userId);
};

const generateSignature = async (orderId, paymentId, razorpaySignature) => {
  return await crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(orderId + "|" + paymentId)
    .digest("hex");
};

const orderPaymentUpdate = async (userId, orderId, paymentId) => {
  return await User.findOneAndUpdate(
    { _id: userId, "order._id": orderId },
    {
      $set: {
        "order.$.paymentDetails.paymentId": paymentId,
      },
    }
  );
};

// const verifyPayment = async (orderId, paymentId, razorpaySignature) => {
//   // try {
//   //   const { orderId, paymentId, razorpaySignature } = await req.body;
//   //   const generateSignature = await crypto
//   //     .createHmac("sha256", process.env.RAZORPAY_SECRET)
//   //     .update(orderId + "|" + paymentId)
//   //     .digest("hex");
//   //   console.log(generateSignature);
//   //   console.log(razorpaySignature);
//   //   if (generateSignature === razorpaySignature) {
//   //     return res
//   //       .status(200)
//   //       .send({ success: true, message: "Payment verified successfully" });
//   //   }
//   //   return res
//   //     .status(400)
//   //     .send({ success: false, message: "payment verification failed" });
//   // } catch (error) {
//   //   console.log(error);
//   //   return res
//   //     .status(500)
//   //     .send({ success: false, message: "payment verification failed" });
//   // }
// };

export { creatOrder, generateSignature };
