const { ProductModel } = require("../models/ProductModel");
const PermissionService = require("./PermissionService");

const uploadProduct = async (req, res, next) => {

    try {

        PermissionService.verifyAdminPermission(req);

        const productData = req.body.productData;
        const newProduct = new ProductModel(productData);
        const savedProduct = await newProduct.save();

        const cleanedSavedProduct = {
            productId: savedProduct.productId,
            brand: savedProduct.brand,
            categories: savedProduct.categories,
            description: savedProduct.description,
            images: savedProduct.images,
            items: savedProduct.items
        };

        res.send(cleanedSavedProduct);

    } catch (error) {

        return next(error);
    }
};

const getProducts = async (req, res, next) => {

    try {

        const foundProducts = await ProductModel.find({});
        res.send(foundProducts);

    } catch (error) {

        next(error);
    }
};

async function deleteProduct(req, res) {
    
    try {

        PermissionService.verifyAdminPermission(req);
        let deletedProduct = await ProductModel.findByIdAndRemove(req.params.id);

        if (!deletedProduct) {

            res.send({ message: "failure", error: "Product not found" });

        } else {

            res.send(deletedProduct)
        }

    } catch (e) {

        next(error);
    }
};

async function editProduct(req, res) {

    try {

        const productData = req.body.productData;
        PermissionService.verifyAdminPermission(req);
        let updatedProduct = await ProductModel.findByIdAndUpdate(
            req.params.id,
            productData,
            {
                new: true
            }
        );

        if (!updatedProduct) {

            res.send({ message: "failure", error: "Product not found" });

        } else {

            res.send(updatedProduct)
        }

    } catch (e) {

        next(error);
    }
};

const ProductService = {
    uploadProduct,
    getProducts,
    deleteProduct,
    editProduct
};

module.exports = ProductService;