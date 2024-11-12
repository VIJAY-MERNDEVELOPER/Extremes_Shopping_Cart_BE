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

export const updateProductById = async (id, productData) => {
  return await Products.updateOne({ _id: id }, { productData });
};

export const deleteProductId = async (id) => {
  return await Products.findOneAndDelete({ _id: id });
};

export const setOutOfStock = async (id) => {
  return await Products.findByIdAndUpdate(
    { _id: id },
    { $set: { isOutOfStock: true } }
  );
};
