import { Router } from "express";
import {
  creatOrder,
  generateSignature,
} from "../controllers/PaymentController.js";
import { validateToken } from "../middleware/auth.js";

const router = Router();

// router.post("/:id", createPayementLinkController);
// router.get("/", updatePaymentInfoController);

router.post("/createorder", validateToken, async (req, res) => {
  try {
    const userId = req.userId;
    // const orderData = req.body;
    // const order = creatOrder(userId, orderData);
    const { totalAmount, receipt } = await req.body;

    const options = {
      amount: Number(totalAmount) * 100,
      currency: "INR",
      receipt: receipt,
    };
    const orderData = await creatOrder(options);
    return res.status(200).send({
      success: true,
      orderId: orderData.id,
      amount: orderData.amount,
      currency: orderData.currency,
    });
  } catch (error) {
    return res
      .status(error.statusCode)
      .send({ success: false, message: error.error.message });
  }
});
router.post("/verifypayment", async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } =
      await req.body;
    const generatedSignature = await generateSignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );
    if (generatedSignature === razorpaySignature) {
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
});

export const paymentRoutes = router;
