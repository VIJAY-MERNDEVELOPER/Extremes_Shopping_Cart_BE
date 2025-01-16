import { Router } from "express";
import { validateToken } from "../middleware/auth.js";
import {
  addAddress,
  deleteAddress,
  getAddressById,
  getAddresses,
} from "../controllers/addressController.js";

const router = Router();

router.post("/addaddress", validateToken, async (req, res) => {
  try {
    const userId = req?.userId;
    const addressData = await req?.body;
    // console.log(address);

    const address = await addAddress(userId, addressData);
    console.log(address);
    return res
      .status(200)
      .send({ message: "Address Added", address: address[0] });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});

router.delete("/deleteaddress/:addressId", validateToken, async (req, res) => {
  try {
    const userId = await req?.userId;
    const { addressId } = await req?.params;
    const deletedAddress = await deleteAddress(userId, addressId);
    console.log(deletedAddress);
    return res.status(200).send({ message: "Address Deleted", deletedAddress });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});

router.get("/getaddress", validateToken, async (req, res) => {
  try {
    const userId = await req?.userId;
    const [{ address }] = await getAddresses(userId);
    if (address.length > 0) {
      return res.status(200).send({ message: "Addresses Fetched", address });
    } else
      return res
        .status(404)
        .send({ message: "Address Not Available", address });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});

router.get("/getaddress/:addressId", validateToken, async (req, res) => {
  try {
    const { addressId } = await req?.params;
    console.log(addressId);
    const userId = await req?.userId;
    const { address } = (await getAddressById(userId, addressId)) || {};
    console.log(address);
    if (address) {
      return res
        .status(200)
        .send({ message: "Addresses Fetched", address: address[0] });
    } else
      return res
        .status(404)
        .send({ message: "Address Not Available", address });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});

export const addressRoutes = router;
