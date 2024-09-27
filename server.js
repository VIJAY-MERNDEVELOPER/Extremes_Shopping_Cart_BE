import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { userRoutes } from "./src/routes/userRoutes.js";

import { dbConnection } from "./src/db/db.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose, { mongo } from "mongoose";

dotenv.config();
const app = express();

const secretkey = process.env.SECRET_KEY;

// All the  MiddleWares required are used here
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
// credentials: true,
// methods: ["GET", "POST", "PUT", "DELETE"],
// allowedHeaders: ["Content-Type"],

// { credentials: true, origin: "https://krc-frontend.onrender.com/" }
// app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser(secretkey));
// Calling MongoDB connection
dbConnection();
app.use(
  session({
    secret: secretkey,
    saveUninitialized: false, // A new empty session will not be created and saved to the session store until the session data is added
    // saveunitialized:true,  // creates and stores a session for every visit without adding/modifying session data
    resave: false, //the session will not save to the store for each request when the data in a session is not modified
    // resave:true, //the session will save to store on each request even the data is not modified
    cookie: {
      maxAge: 60000 * 60,
    },
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
    }),
  })
);

// initializing passport

// Port from Environment Variable
const PORT = process.env.PORT;

// Calling MongoDB connection
// dbConnection();

// Define routes
app.use("/api/user", userRoutes);
// app.use("/api/products", productRoutes);

app.listen(PORT, () => console.log(`Server listening to PORT: ${PORT}`));

// By default session stored in server memory when it restarted the session will be cleared
// session have to be stored in DB for better usage
