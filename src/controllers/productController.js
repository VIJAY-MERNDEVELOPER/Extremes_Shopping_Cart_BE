import { ReturnDocument } from "mongodb";
import { Products } from "../model/productModel.js";

export const createNewProduct = async (productData) => {
  return await Products.create({ ...productData });
};

export const getAllProducts = async () => {
  return await Products.find({});
};

export const getProductById = async (id) => {
  return await Products.findOne({ _id: id });
};

export const getProductsById = async (productId) => {
  return await Products.find({ _id: { $in: productId } });
};

export const getProductsByQuery = async (
  page,
  limit,
  sortname = "createdAt",
  sort = "desc"
) => {
  // console.log(sortName, sortValue);
  const sortValue = sort === "desc" ? -1 : 1;
  const skipValue = (Number(page) - 1) * Number(limit);

  return await Products.find()
    .sort({ [sortname]: sortValue })
    .skip(skipValue)
    .limit(Number(limit));
};

export const getProductByCategory = async (
  category,
  subCategory,
  sortName,
  sort
) => {
  const sortValue = sort === "desc" ? -1 : 1;
  return await Products.find({ category, subCategory }).sort({
    [sortName]: sortValue,
  });
};

// export const getProductQuantity = async (productId, size) => {
//   return await Products.find({_id:productId});
// };

export const updateProductById = async (id, productData) => {
  return await Products.findOneAndUpdate(
    { _id: id },
    { ...productData },
    { returnDocument: "after" } //here returnDocument will return updated Data
  );
};

export const deleteProductById = async (id) => {
  return await Products.findOneAndDelete({ _id: id });
};

export const setOutOfStock = async (id) => {
  return await Products.findByIdAndUpdate(
    { _id: id },
    { $set: { isOutOfStock: true } }
  );
};
