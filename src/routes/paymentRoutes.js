import { Router } from "express";
import { creatOrder, verifyPayment } from "../controllers/PaymentController.js";

const router = Router();

// router.post("/:id", createPayementLinkController);
// router.get("/", updatePaymentInfoController);

router.post("/orders", creatOrder);
router.post("/verify", verifyPayment);

export const paymentRoutes = router;
