import { Router } from "express";
import { adminAuth, validateToken } from "../middleware/auth.js";
import {
  cancelOrderById,
  createOrder,
  findOrderById,
  getAllOrders,
  getUsersAllOrders,
  updateOrderAddress,
  updateOrderStaus,
} from "../controllers/orderController.js";
import { getUser } from "../controllers/userController.js";
import { getProductsById } from "../controllers/productController.js";

const router = Router();

router.post("/createorder", validateToken, async (req, res) => {
  try {
    const orderData = await req.body;
    const userId = await req.userId;
    const [orderResponse] = await createOrder(userId, orderData);
    console.log(orderResponse);

    if (orderResponse) {
      return res
        .status(200)
        .send({ message: "order created successfully", order: orderResponse });
    }
    return res.status(401).send({ message: "unable to add order" });
  } catch (error) {
    return res.status(400).send({ message: error.stack.message });
  }
});

router.patch(
  "/adddeliveryaddress/:orderId",
  validateToken,
  async (req, res) => {
    try {
      const { orderId } = await req.params;

      const userId = await req.userId;
      const { addressId } = await req?.body;

      const isOrder = await findOrderById(userId, orderId);
      if (isOrder) {
        const updatedOrder = await updateOrderAddress(
          userId,
          orderId,
          addressId
        );
        console.log(updatedOrder);
        if (updatedOrder) {
          return res
            .status(201)
            .send({ message: "address Updated", updatedOrder });
        }
        return res
          .status(404)
          .send({ message: `order ${isOrder._id} is not found` });
      }
    } catch (error) {
      return res.status(400).send({ message: error.stack.message });
    }
  }
);

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

    const { order } = await findOrderById(userId, orderid);
    console.log(order);
    return res.status(200).send({ message: "order fetched", order: order[0] });
  } catch (error) {
    return res.status(500).send({ message: error.stack.message });
  }
});

router.get("/getordersummary/:orderId", validateToken, async (req, res) => {
  try {
    const { orderId } = await req.params;
    const userId = await req.userId;
    const { order } = await findOrderById(userId, orderId);
    if (!order || order.length === 0) {
      return res.status(404).send({ message: "Order not found" });
    }
    const [{ orderItems }] = order;
    const productId = order[0]?.orderItems?.map((item) => item.productId);
    // console.log(productId);

    const products = await getProductsById(productId);
    // console.log(orderItems);
    if (!products || products.length === 0) {
      return res.status(404).send({ message: "Products not found" });
    }

    // const newOrder = order.map((orde) => {
    //   const { orderItems } = orde;
    //   // console.log(orderItems);
    //   order.orderItems = orderItems.map((item) => {
    //     const product = products.find(
    //       (product) => product._id.toString() == item.productId.toString()
    //     );
    //     // console.log(product);
    //     if (product) {
    //       console.log({
    //         ...item,
    //         productName: product?.productName,
    //         productDescription: product?.productDescription,
    //         productImage: product?.productImages[0],
    //       });
    //       return {
    //         ...item,
    //         productName: product?.productName,
    //         productDescription: product?.productDescription,
    //         productImage: product?.productImages[0],
    //       };
    //     }
    //     return item;
    //   });
    //   return orde;
    // });
    // console.log(newOrder);
    return res.status(200).send({ newOrder });
  } catch (error) {
    return res.status(500).send({ message: error.message });
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
