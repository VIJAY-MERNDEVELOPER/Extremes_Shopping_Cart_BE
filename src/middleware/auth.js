import jwt from "jsonwebtoken";
import { getUser } from "../controllers/userController.js";

const auth = async (req, res, next) => {
  try {
    const token = req.signedCookies.token;
    // const token = await req.headers["x-auth-token"];
    const id = await req.headers.id;

    if (token && id) {
      const decode = jwt.verify(token, process.env.SECRET_KEY);

      const user = await getUser(decode.id);

      const recipe = await getRecipeById(id);

      if (recipe[0].user.userid == user._id || user.role === "Admin") {
        next();
      } else res.status(401).send({ message: "unauthorized" });
    }
  } catch (error) {
    res.status(400).send({ message: "unauthorized" });
  }
};

const validateToken = async (req, res, next) => {
  try {
    const token = req.signedCookies.token;
    // const token = await req.headers["x-auth-token"];

    const decode = await jwt.decode(token);

    const expiry = new Date(decode.exp * 1000);

    const current = new Date();

    if (expiry > current) {
      return next();
    }
    return res.status(400).send({ message: "Session expired" });
  } catch (error) {
    res.status(400).send({ message: "Session expired" });
  }
};

const adminAuth = async (req, res, next) => {
  try {
    const token = req.signedCookies.token;
    const userRole = req.signedCookies.role;
    // const token = await req.headers["x-auth-token"];
    // const userRole = await req.headers.role;

    const decode = jwt.decode(token);

    if (decode.role === "Admin" && userRole === "Admin") {
      return next();
    }
    return res.status(400).send({ message: "Login as a Admin to continue" });
  } catch (error) {
    res.status(400).send({ message: "Login as a Admin to continue" });
  }
};

export { auth, validateToken, adminAuth };
