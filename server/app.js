const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require("express-fileupload");
require("dotenv").config();

const server = express();
server.set("trust proxy", 1);
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "https://productr-flax.vercel.app",
].filter(Boolean);

// Middleware
server.use(express.json());
server.use(fileUpload({ useTempFiles: true }));
server.use(express.static("public"));
server.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Routes
server.use("/api/auth", require("./routes/auth"));
server.use("/api/products", require("./routes/product"));

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    server.listen(process.env.PORT, () => {
      console.log(`Server is Running on port ${process.env.PORT}`);
    });
    console.log("Database is connected");
  })
  .catch((error) => {
    console.log("Database is not connected");
    console.log(error);
  });
