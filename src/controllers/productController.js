import { Products } from "../model/productModel";

const createNewProduct = async () => {
  return await Products.save({});
};
