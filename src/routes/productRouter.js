const express = require('express');
const ProductService = require('../services/ProductService');
const productRouter = express.Router();

productRouter.post(
    '/upload-product',
    ProductService.uploadProduct
);

productRouter.get(
    '/get-products',
    ProductService.getProducts
)

productRouter.delete(
    "/delete-product/:id",
    ProductService.deleteProduct
);

productRouter.put(
    "/update-product/:id",
    ProductService.editProduct
);

module.exports = productRouter;