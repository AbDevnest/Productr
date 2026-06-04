const productRouter = require("express").Router();
const {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  togglePublish,
  deleteImage,
} = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");

productRouter.use(authMiddleware);

productRouter.post("/create", addProduct);
productRouter.get("/", getProducts);
productRouter.put("/update/:id", updateProduct);
productRouter.delete("/delete/:id", deleteProduct);
productRouter.patch("/publish/:id", togglePublish);
productRouter.delete("/image/delete/:id", deleteImage);

module.exports = productRouter;