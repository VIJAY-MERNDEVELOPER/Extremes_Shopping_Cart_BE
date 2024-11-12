import { User } from "../model/userModel.js";

async function createOrder(userId, orderData) {
  /*
orderData in the  format of
_id:ObjectId(""),
orderItems:[{"productId:"","size":"","quantity":Num,"price":Num,"discountPrice":Num,"deliveryDate":Date}],
totalAmount:Num,
totalItems:Num,
discount:Num,
orderDate:Date,
shippingAddress:address,
orderStatus:pending,
paymentDetails:{
"paymentMethod":"UPI",
"transactionId":"string",
"paymentId":"string",
paymentStatus:pending
}

*/
  // console.log("body", orderData);
  return await User.findByIdAndUpdate(
    { _id: userId },
    { $push: { order: orderData } },
    { new: true }
  )
    .then((result) => result.order)
    .catch((error) => error.message);
}

async function findOrderById(userId, orderId) {
  return await User.findOne(
    { _id: userId, "order._id": orderId },
    { "order.$": 1, _id: 0 }
  );
}

async function getUsersAllOrders(userId) {
  return await User.findOne({ _id: userId }, { order: 1, _id: 0 });
}

async function getAllOrders() {
  return await User.find({}, { order: 1, _id: 0 });
}

async function updateOrderStaus(userId, orderId, orderStatus) {
  return await User.findOneAndUpdate(
    { _id: userId, "order._id": orderId },
    { $set: { "order.$.orderStatus": orderStatus } },
    { new: true }
  )
    .then(() => findOrderById(userId, orderId))
    .catch((error) => {
      throw new Error(error);
    });
}

// still work pending
async function cancelOrderById(userId, orderId, cancellationReason, role) {
  return await User.findOneAndUpdate(
    {
      _id: userId,
      "order._id": orderId,
      "order.orderStatus": { $in: ["Pending", "Shipped"] },
    },
    {
      $set: {
        "order.$.isCancelled": true,
        "order.$.orderStatus": "Cancelled",
        "order.$.cancellationReason": cancellationReason,
        "order.$.cancellationDate": Date.now(),
        "order.$.cancelledBy": role,
      },
    },
    { new: true }
  )
    .then(() => findOrderById(userId, orderId))
    .catch((error) => {
      throw new Error(error);
    });
}

export {
  createOrder,
  findOrderById,
  getUsersAllOrders,
  getAllOrders,
  updateOrderStaus,
  cancelOrderById,
};

/*
Place an Order: POST /orders
Get User's Orders: GET /orders/user/:userId
Get All Orders (Admin): GET /orders
Get Single Order by ID: GET /orders/:orderId
Update Order Status: PUT /orders/:orderId/status
Delete/Cancel Order: DELETE /orders/:orderId
Add Payment Information: POST /orders/:orderId/payment
Track Order: GET /orders/:orderId/tracking
 */
