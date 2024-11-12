import { razorpayInstance } from "../config/razorpayClient.js";
import crypto from "crypto";
import { findOrderById } from "./orderController.js";
import { getUser } from "./userController.js";

// Service creating

// const createPayementLink = async (userId, orderId) => {
//   try {
//     const order = await findOrderById(userId, orderId);
//     const user = await getUser(userId);
//     const paymentLinkRequest = {
//       amount: order.totalAmount * 100,
//       currency: "INR",
//       customer: {
//         name: user.username,
//         contact: 9003785038,
//         email: user.email,
//       },
//       notify: {
//         sms: true,
//         email: true,
//       },
//       remainder_enable: true,
//       callback_url: `http://locahost:3000/payment/${orderId}1`,
//       callback_method: "get",
//     };
//     const paymentLink = await razorpayInstance.paymentLink.create(
//       paymentLinkRequest
//     );
//     const paymentLinkId = paymentLink.id;
//     const payment_Link_url = paymentLink.short_url;
//     const resData = {
//       paymentLinkId,
//       payment_Link_url,
//     };

//     return resData;
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };

// const updatePaymentInfo = async (reqData) => {
//   const paymentId = reqData.paymentId;
//   const orderId = reqData.orderId;
//   try {
//     const order = await findOrderById(orderId);
//     const payment = await razorpayInstance.payments.fetch(paymentId);

//     if (payment.status === "captured") {
//       order.paymentDetails.paymentId = paymentId;
//       order.paymentDetails.status = "completed";
//       order.orderStatus = "placed";
//       await order.save;
//     }
//     return { message: "your order placed successfully", success };
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };

// ---------------------------------------------------------------------------------------

// creating controller

// const createPayementLinkController = async (req, res) => {
//   const { id, token } = req.signedCookies;
//   const orderId = req.params.id;
//   try {
//     const paymentLink = await createPayementLink(id, orderId);
//     return res.status().send(paymentLink);
//   } catch (error) {
//     return res.status(500).send(error.message);
//   }
// };

// const updatePaymentInfoController = async (req, res) => {
//   try {
//     const paymentLink = await updatePaymentInfo(req.query);
//     return res
//       .status()
//       .send({ message: "payment info updated ", status: true });
//   } catch (error) {
//     return res.status(500).send(error.message);
//   }
// };

const creatOrder = async (req, res) => {
  try {
    const userId = req.userId;
    // const orderData = req.body;
    // const order = creatOrder(userId, orderData);
    const { amount, receipt } = await req.body;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: receipt,
    };

    const orderData = await razorpayInstance.orders.create(options);

    return res.status(200).send({
      success: true,
      orderId: orderData.id,
      amount: orderData.amount,
      currency: orderData.currency,
    });

    //     const user = await getUser(userId);
  } catch (error) {
    return res
      .status(error.statusCode)
      .send({ success: false, message: error.error.message });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { orderId, paymentId, razorpaySignature } = await req.body;

    const generateSignature = await crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(orderId + "|" + paymentId)
      .digest("hex");
    if (generateSignature === razorpaySignature) {
      return res
        .status(200)
        .send({ success: true, message: "Payment verified successfully" });
    }
    return res
      .status(400)
      .send({ success: false, message: "payment verification failed" });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, message: "payment verification failed" });
  }
};

export { creatOrder, verifyPayment };
