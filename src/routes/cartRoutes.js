import { Router } from "express";
import { validateToken } from "../middleware/auth.js";
import {
  addProducToCart,
  cartProductQuantityUpdate,
  cartProductUpdate,
  fetchCartProduct,
  findCartItem,
  findProductInCart,
  removeProductFromCart,
} from "../controllers/cartController.js";
import {
  getProductById,
  getProductsById,
} from "../controllers/productController.js";

const router = Router();

// Route to add product to cart
// It gets userId from validatetoken middleware and product Id, Quantity from body
router.post("/addtocart", validateToken, async (req, res) => {
  try {
    const userId = await req?.userId;
    console.log(userId);
    const productData = await req.body;
    console.log(productData);

    const { productId, quantity, size } = productData;
    const checkProduct = await getProductById(productId);
    const availableQuantity = checkProduct.stocks[size];

    if (checkProduct) {
      if (checkProduct.stocks[size] < quantity) {
        return res.status(204).send({ message: "Out Of Stock" });
      }
      const product = await findProductInCart(userId, productId);

      if (product.productId && product.size === size) {
        const cartData = await cartProductUpdate(userId, productId, quantity);

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
    const [{ cart }] = await fetchCartProduct(userId);
    const productIds = cart.map((item) => item.productId);
    const totalCartItem = cart.reduce((sum, item) => sum + item.quantity, 0);
    const products = await getProductsById(productIds);

    const filteredProducts = products.reduce((acc, item) => {
      acc[item._id] = item;
      return acc;
    }, {});
    // console.log(filteredProducts);
    let totalPrice = 0;
    let totalDiscount = 0;
    cart.forEach((item) => {
      const { productPrice, discountPercentage } =
        filteredProducts[item.productId];
      const price = productPrice * item.quantity;
      totalPrice += price;
      totalDiscount += Math.round((price * discountPercentage) / 100);
    });

    // console.log(cart, totalCartItem);
    if (cart) {
      return res.status(200).send({
        message: "cart data fetched successfully",
        cart,
        totalCartItem,
        totalPrice,
        totalDiscount,
      });
    }
    return res.status(404).send({ message: "cart Data not available" });
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
});

// Router to update product quantity
// it get product id from body

router.put("/updatecartquantity/:cartId", validateToken, async (req, res) => {
  try {
    const userId = await req?.userId;
    const { cartId } = await req?.params;

    const { quantity } = await req?.body;

    const [cartItem] = await findCartItem(userId, cartId);
    const product = await getProductById(cartItem.productId);
    // console.log(product.stocks[cartItem.size]);
    // console.log(quantity);

    if (cartItem) {
      if (product.stocks[cartItem.size] > quantity) {
        const updatedCartProduct = await cartProductQuantityUpdate(
          userId,
          cartId,
          quantity
        );
        return res
          .status(200)
          .send({ message: "product quantity update", updatedCartProduct });
      }
      return res.status(409).send({ message: "stock not available" });
    } else
      return res.status(404).send({ message: "Product not found in cart" });
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
});

// Router to delete or remove product from cart

router.delete("/deleteproduct/:cartId", validateToken, async (req, res) => {
  try {
    const { cartId } = await req.params;
    if (!cartId) {
      return res.status(400).send({ message: "cart Id is required" });
    }

    const userId = await req?.userId;
    const deletedProduct = await findProductInCart(userId, cartId);

    const updateCart = await removeProductFromCart(userId, cartId);

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
