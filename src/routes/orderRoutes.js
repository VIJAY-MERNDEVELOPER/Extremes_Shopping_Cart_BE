import { Router } from "express";
import { adminAuth, validateToken } from "../middleware/auth.js";
import {
  cancelOrderById,
  createOrder,
  findOrderById,
  getAllOrders,
  getUsersAllOrders,
  updateOrderStaus,
} from "../controllers/orderController.js";
import { getUser } from "../controllers/userController.js";

const router = Router();

router.post("/addorder", validateToken, async (req, res) => {
  try {
    const orderData = await req.body;
    const userId = await req.userId;
    const orderResponse = await createOrder(userId, orderData);
    if (orderResponse) {
      return res
        .status(200)
        .send({ message: "order added successfully", order: orderResponse });
    }
    return res.status(401).send({ message: "unable to add order" });
  } catch (error) {
    return res.status(400).send({ message: error.stack.message });
  }
});

router.get("/getuserorder", validateToken, async (req, res) => {
  try {
    const userId = await req.userId;

    const userOrder = await getUsersAllOrders(userId);
    return res.status(200).send({ message: "users order fetched", userOrder });
  } catch (error) {
    return res.status(500).send({ message: error.stack.message });
  }
});

router.get("/getorder/:orderid", validateToken, async (req, res) => {
  try {
    const { orderid } = await req.params;
    const userId = await req.userId;

    const orderResponse = await findOrderById(userId, orderid);
    return res
      .status(200)
      .send({ message: "order fetched", order: orderResponse });
  } catch (error) {
    return res.status(500).send({ message: error.stack.message });
  }
});

router.put("/updatestatus/:orderId", validateToken, async (req, res) => {
  try {
    const { orderId } = await req.params;
    const userId = await req.userId;

    const { orderStatus } = await req.body;

    const updatedOrder = await updateOrderStaus(userId, orderId, orderStatus);

    return res
      .status(200)
      .send({ message: "order status updated successfully", updatedOrder });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});

// router.get("/trackorder/:orderId", validateToken, async (req, res) => {
//   try {
//   } catch (error) {
//     return res.status(500).send({ message: error.message });
//   }
// });

router.get("/getallorders", validateToken, adminAuth, async (req, res) => {
  try {
    const allOrders = await getAllOrders();

    res.status(201).send({ allOrders });
  } catch (error) {
    return res.status(500).send({ message: error.stack.message });
  }
});

// cancel order not yet completed
router.put("/cancelorder/:orderId", validateToken, async (req, res) => {
  try {
    const userId = await req.userId;
    const user = await getUser(userId);
    console.log(user.role);
    const { orderId } = await req.params;
    const { cancellationReason } = req.body;
    const cancelledOrder = await cancelOrderById(
      userId,
      orderId,
      cancellationReason,
      user.role
    );
    return res
      .status(200)
      .send({ message: "order cancelled successfully", cancelledOrder });
  } catch (error) {
    return res.status(500).send({ message: error.stack.message });
  }
});

export const orderRoutes = router;
