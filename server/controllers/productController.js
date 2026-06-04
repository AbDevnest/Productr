const {
  succeesResponse,
  createResponse,
  updateResponse,
  deleteResponse,
  allFields_Response,
  notFound_Response,
  serverError_Response,
} = require("../helper/responseHelper");

const { createUniqueFileName } = require("../helper/helper");
const ProductModel = require("../models/products.model");

// Create Product
const addProduct = async (req, res) => {
  try {
        console.log("BODY =>", req.body);
    console.log("FILES =>", req.files);

    const {
      name,
      productType,
      quantityStock,
      mrp,
      sellingPrice,
      brandName,
      exchangeEligible,
    } = req.body;

    if (
      !name ||
      !productType ||
      !quantityStock ||
      !mrp ||
      !sellingPrice ||
      !brandName
    ) {
      return allFields_Response(res);
    }

    let images = [];

    if (req.files && req.files.images) {
      const files = req.files.images;

      // Multiple images aaye to array hoga, single image to object
      if (Array.isArray(files)) {
        const allImages = await Promise.all(
          files.map(async (img) => {
            const imageName = createUniqueFileName(img.name);
            const destination = "./public/images/products/" + imageName;
            await new Promise((resolve, reject) => {
              img.mv(destination, (err) => {
                if (err) reject(err);
                else resolve();
              });
            });
            return imageName;
          }),
        );
        images = allImages;

      } else {
        // Single image
        const imageName = createUniqueFileName(files.name);
        const destination = "./public/images/products/" + imageName;
        await new Promise((resolve, reject) => {
          files.mv(destination, (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
        images = [imageName];
      }
    }

    await ProductModel.create({
      name,
      productType,
      quantityStock,
      mrp,
      sellingPrice,
      brandName,
      exchangeEligible,
      images,
    });

    return createResponse(res);
  } catch (error) {
    console.log(error);
    return serverError_Response(res);
  }
};

// Get All Products
const getProducts = async (req, res) => {
  try {
    const products = await ProductModel.find().sort({ createdAt: -1 });
    const imageBaseUrl = `${req.protocol}://${req.get("host")}/images/products/`;
    return succeesResponse(res, "Products found", { products, imageBaseUrl });
  } catch (error) {
    return serverError_Response(res);
  }
};

// Update Product
const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await ProductModel.findById(id);
    if (!product) return notFound_Response(res, "Product not found");

    const {
      name,
      productType,
      quantityStock,
      mrp,
      sellingPrice,
      brandName,
      exchangeEligible,
    } = req.body;

    // Purani images rakho, nayi images ko append karo
    let images = [...product.images];

    // Agar nayi images aayi hain
    if (req.files && req.files.images) {
      const files = req.files.images;

      if (Array.isArray(files)) {
        const allImages = await Promise.all(
          files.map(async (img) => {
            const imageName = createUniqueFileName(img.name);
            const destination = "./public/images/products/" + imageName;
            await new Promise((resolve, reject) => {
              img.mv(destination, (err) => {
                if (err) reject(err);
                else resolve();
              });
            });
            return imageName;
          }),
        );
        images = [...images, ...allImages];
      } else {
        const imageName = createUniqueFileName(files.name);
        const destination = "./public/images/products/" + imageName;
        await new Promise((resolve, reject) => {
          files.mv(destination, (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
        images = [...images, imageName];
      }
    }

    await ProductModel.findByIdAndUpdate(id, {
      $set: {
        name,
        productType,
        quantityStock,
        mrp,
        sellingPrice,
        brandName,
        exchangeEligible,
        images,
      },
    });

    return updateResponse(res);
  } catch (error) {
    console.log(error);
    return serverError_Response(res);
  }
};

// Delete Product
const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await ProductModel.findById(id);
    if (!product) return notFound_Response(res, "Product not found");

    await ProductModel.findByIdAndDelete(id);
    return deleteResponse(res);
  } catch (error) {
    console.log(error);
    return serverError_Response(res);
  }
};

// Publish / Unpublish Toggle
const togglePublish = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await ProductModel.findById(id);
    if (!product) return notFound_Response(res, "Product not found");

    await ProductModel.findByIdAndUpdate(id, {
      $set: { isPublished: !product.isPublished },
    });

    return updateResponse(res);
  } catch (error) {
    console.log(error);
    return serverError_Response(res);
  }
};

// Delete Single Image
const deleteImage = async (req, res) => {
  try {
    const id = req.params.id;
    const { image_name } = req.body;

    const product = await ProductModel.findById(id);
    if (!product) return notFound_Response(res, "Product not found");

    // Us image ko filter karke hata do
    product.images = product.images.filter((img) => img !== image_name);
    await product.save();

    return deleteResponse(res);
  } catch (error) {
    console.log(error);
    return serverError_Response(res);
  }
};

module.exports = {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  togglePublish,
  deleteImage,
};
