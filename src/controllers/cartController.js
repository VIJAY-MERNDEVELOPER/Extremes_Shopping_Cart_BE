import { User } from "../model/userModel.js";

export async function addProducToCart(userId, productData) {
  //   return await User.findByIdAndUpdate(userId, { $push: { cart: productData } });
  return await User.findByIdAndUpdate(
    { _id: userId },
    { $push: { cart: productData } },
    { new: true }
  )
    .select(
      "-_id -email -password -role -paymentMethod -wishlist -order -address -username -createdAt -__v"
    )
    .then((result) => result.cart)
    .catch((error) => error.message);
}

export async function fetchCartProduct(userId) {
  return await User.find({ _id: userId }, { cart: 1, _id: 0 });
}

export async function findProductInCart(userId, productId) {
  return await User.findOne(
    { _id: userId, "cart.productId": productId },
    { "cart.$": 1, _id: 0 }
  )
    .then((result) => {
      // console.log(result);
      return result.cart[0]; // The updated cart with the new quantity
    })
    .catch((error) => {
      return error.message;
    });

  //  User.findById(userId, { "cart.productId": productId });
}

export async function removeProductFromCart(userId, productId) {
  return await User.findByIdAndUpdate(
    userId,
    {
      $pull: { cart: { productId: productId } },
    },
    { new: true }
  ).select(
    "-_id -email -password -role -paymentMethod -wishlist -order -address -username -createdAt -__v "
  );
}

export async function cartProductQuantityUpdate(
  userId,
  productId,
  newQuantity
) {
  return await User.findOneAndUpdate(
    { _id: userId, "cart.productId": productId },
    { $inc: { "cart.$.quantity": newQuantity } },
    { new: true }
  )
    .then((result) => {
      // console.log(result);
      return result.cart; // The updated cart with the new quantity
    })
    .catch((error) => {
      return error;
    });
}
