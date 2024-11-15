import { Router } from "express";
import {
  createNewProduct,
  getAllProducts,
  getProductById,
  updateProductById,
} from "../controllers/productController.js";
import { upload } from "../middleware/multer.js";
import { validateToken } from "../middleware/auth.js";

const router = Router();

router.post(
  "/addproduct",
  validateToken,
  upload.array("productImages"),
  async (req, res) => {
    try {
      const productData = await req.body;
      const imagePath = req?.files.map((file) => file.path);
      // console.log(req.files);
      await createNewProduct({ ...productData, productImages: [...imagePath] });
      console.log({ ...productData });
      return res.status(201).send({ message: "product created", productData });
    } catch (error) {
      return res
        .status(500)
        .send({ message: error.message || "Internal Server Error" });
    }
  }
);

router.get("/getallproducts", async (req, res) => {
  try {
    const products = await getAllProducts();
    return res.status(200).send({ message: "all products received", products });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: error.message || "Internal Server Error" });
  }
});

router.get("/product/:id", async (req, res) => {
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

router.put("/editproduct/:id", async (req, res) => {
  try {
    const { id } = await req.params;
    const productData = await req.body;
    console.log(productData);
    if (id) {
      const product = await getProductById(id);
      if (product) {
        const updatedProduct = await updateProductById(id, productData);
        return res
          .status(200)
          .send({ message: "updated successfully", productData });
      }
      return res.status(404).send({ message: "product not found" });
    }
    return res.status(400).send({ message: "product ID not available" });
  } catch (error) {
    console.log(error);
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
