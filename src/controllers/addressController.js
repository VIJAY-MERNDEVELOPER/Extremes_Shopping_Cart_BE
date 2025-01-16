import { User } from "../model/userModel.js";

export const getAddresses = async (userId) => {
  return await User.find({ _id: userId }, { address: 1, _id: 0 });
};

export const getAddressById = async (userId, addressId) => {
  return await User.findOne(
    { _id: userId, "address._id": addressId },
    { "address.$": 1, _id: 0 }
  );
};

export const addAddress = async (userId, address) => {
  return await User.findByIdAndUpdate(
    { _id: userId },
    { $push: { address: address } },
    { new: true }
  )
    .select({ address: { $slice: -1 } })
    .then((result) => result.address)
    .catch((error) => error.message);
};

export const deleteAddress = async (userId, addressId) => {
  return await User.findByIdAndUpdate(
    userId,
    {
      $pull: { address: { _id: addressId } },
    },
    { new: true }
  ).select(
    "-_id -email -role -paymentMethod -wishlist -order -cart -username -createdAt -__v"
  );
};
