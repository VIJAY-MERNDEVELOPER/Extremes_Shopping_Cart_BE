import { Router } from "express";
import {
  createNewProduct,
  deleteProductById,
  getAllProducts,
  getProductByCategory,
  getProductById,
  getProductsById,
  getProductsByQuery,
  updateProductById,
} from "../controllers/productController.js";
import { upload } from "../middleware/multer.js";
import { validateToken } from "../middleware/auth.js";
import { Products } from "../model/productModel.js";

const router = Router();

router.post("/addproduct", upload.array("productImages"), async (req, res) => {
  try {
    const productData = await req.body;
    productData.stocks = JSON.parse(productData.stocks);

    const imagePath = req?.files.map((file) => file);

    const product = await createNewProduct({
      ...productData,
      productImages: [...imagePath],
    });
    if (product) {
      return res.status(201).send({ message: "product created", product });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: error.message || "Internal Server Error" });
  }
});

router.get("/getallproducts", async (req, res) => {
  try {
    const { page, limit, sortName, sort } = await req.query;
    const totalProducts = await Products.countDocuments();
    if (page || limit || sortName || sort) {
      const products = await getProductsByQuery(page, limit, sortName, sort);
      if (products) {
        return res
          .status(200)
          .send({ message: "all products received", products, totalProducts });
      }
      return res.status(204).send({ message: "Product Not Found" });
    }

    const products = await getAllProducts();

    if (products) {
      return res
        .status(200)
        .send({ message: "all products received", products, totalProducts });
    }
    return res.status(204).send({ message: "Products Not Found" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: error.message || "Internal Server Error" });
  }
});
router.get("/getproducts", async (req, res) => {
  try {
    const { category, subCategory, sortName, sort } = await req.query;
    console.log(category, subCategory, sortName, sort);
    // const totalProducts = await Products.countDocuments();
    if (category || subCategory) {
      const products = await getProductByCategory(
        category,
        subCategory,
        sortName,
        sort
      );
      if (products.length > 0) {
        return res
          .status(200)
          .send({ message: "all products received", products });
      }
      return res.status(204).send({ message: "Product Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: error.message || "Internal Server Error" });
  }
});

router.get("/getproduct/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await getProductById(id);
    return res.status(200).send({ message: "product fetched", product });
  } catch (error) {
    return res
      .status(500)
      .send({ message: error.message || "Internal Server Error" });
  }
});

// router.post("/getproductsbyid", async (req, res) => {
//   try {
//     const productId = await req.body;
//     console.log(productId);
//     if (productId) {
//       const products = await getProductsById(productId);
//       if (products) {
//         return res.status(200).send({ message: "products fetched", products });
//       }
//       return res.status(404).send({ message: "products not found" });
//     }
//   } catch (error) {
//     return res
//       .status(500)
//       .send({ message: error.message || "Internal Server Error" });
//   }
// });

router.put("/editproduct/:id", async (req, res) => {
  try {
    const { id } = await req.params;
    const productData = await req.body;

    if (id) {
      const product = await getProductById(id);
      if (product) {
        const updatedProduct = await updateProductById(id, productData);

        return res
          .status(200)
          .send({ message: "updated successfully", product: updatedProduct });
      }
      return res.status(404).send({ message: "product not found" });
    }
    return res.status(400).send({ message: "product ID not available" });
  } catch (error) {
    return res
      .status(500)
      .send({ message: error.message || "Internal Server Error" });
  }
});

router.delete("/deleteproduct/:id", async (req, res) => {
  try {
    const { id } = await req.params;
    if (id) {
      const product = await getProductById(id);
      if (product) {
        const deleteProduct = deleteProductById(id);
        return res
          .status(200)
          .send({ message: `Product ${id} deleted succesfully`, id });
      } else return res.status(404).send({ message: "Product Not Found" });
    }
    return res.status(400).send({ message: "product ID not available" });
  } catch (error) {
    return res
      .status(500)
      .send({ message: error.message || "Internal Server Error" });
  }
});

// router.post("/test", upload.array("productImages"), async (req, res) => {
//   console.log("test", Array.from(req.files));
//   console.log(req.body.productName);
// });

export const productRoutes = router;
