import jwt from "jsonwebtoken";
import { User } from "../model/userModel.js";
import bcrypt from "bcrypt";

async function userExist(email) {
  return await User.findOne({ email: email }, { _id: 1, cart: 0 });
}

async function getUser(id) {
  return await User.findOne({ _id: id });
}

async function updateUser(id, bodyData) {
  return await User.updateOne({ _id: id }, { ...bodyData });
}

async function deleteUser(id) {
  return await User.deleteOne({ _id: id });
}

async function getAllUser() {
  return await User.find({}, { password: 0 });
}

async function generatePassword(password) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

async function generateToken(id, username, role) {
  const payload = { id, username, role };

  return jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: process.env.EXPIRY_TIME,
  });
}

async function createUser(username, email, newPassword, role) {
  return await User.create({
    username: username,
    email: email,
    password: newPassword,
    role: role,
  });
}

export {
  userExist,
  generatePassword,
  createUser,
  generateToken,
  getUser,
  getAllUser,
  updateUser,
  deleteUser,
};
