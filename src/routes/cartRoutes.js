import { Router } from "express";
import { validateToken } from "../middleware/auth.js";
import {
  addProducToCart,
  cartProductQuantityUpdate,
  fetchCartProduct,
  findProductInCart,
  removeProductFromCart,
} from "../controllers/cartController.js";
import { getProductById } from "../controllers/productController.js";

const router = Router();

// Route to add product to cart
// It gets userId from validatetoken middleware and product Id, Quantity from body
router.post("/addtocart", validateToken, async (req, res) => {
  try {
    const userId = await req?.userId;

    const productData = await req.body;
    const { productId, quantity, size } = productData;
    const checkProduct = await getProductById(productId);

    if (checkProduct) {
      const product = await findProductInCart(userId, productId);

      if (product.productId) {
        const cartData = await cartProductQuantityUpdate(
          userId,
          productId,
          quantity
        );

        return res
          .status(201)
          .send({ message: "cart quantity updated", cartData: cartData });
      } else {
        const cartData = await addProducToCart(userId, productData);

        if (cartData) {
          return res.status(201).send({
            message: "Product added To cart Successfully",
            cartata: cartData,
          });
        }
      }
    }
    return res.status(404).send({ message: "Product Not available" });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});

// Router to get all products in cart

router.get("/getcartproduct", validateToken, async (req, res) => {
  try {
    const userId = await req?.userId;
    const cartData = await fetchCartProduct(userId);

    if (cartData[0].cart.length > 0) {
      return res.status(200).send({
        message: "cart data fetched successfully",
        cart: cartData[0].cart,
      });
    }
    return res.status(404).send({ message: "cart Data not available" });
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
});

// Router to update product quantity
// it get product id from body

router.put("/updatecartquantity", validateToken, async (req, res) => {
  try {
    const userId = await req?.userId;
    const { productId, quantity } = req.body;
    const product = await findProductInCart(userId, productId);

    if (product.productId) {
      const updatedCartProduct = await cartProductQuantityUpdate(
        userId,
        productId,
        quantity
      );
      return res
        .status(200)
        .send({ message: "product quantity update", updatedCartProduct });
    } else
      return res.status(404).send({ message: "Product not found in cart" });
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
});

// Router to delete or remove product from cart

router.delete("/deleteproduct/:productid", validateToken, async (req, res) => {
  try {
    const { productid } = await req.params;
    if (!productid) {
      return res.status(400).send({ message: "product Id is required" });
    }

    const userId = await req?.userId;
    const deletedProduct = await findProductInCart(userId, productid);

    const updateCart = await removeProductFromCart(userId, productid);

    if (updateCart) {
      return res.status(200).send({
        message: "product deleted successfully",
        deletedProduct,
        updateCart,
      });
    } else
      return res.status(404).send({ message: "product not found in cart" });
  } catch (error) {
    return res.status(404).send({ message: error.message });
  }
});

// export router
export const cartRoutes = router;
