const mongoose = require('mongoose');

const priceSchema = new mongoose.Schema(
    {
        regular: {
            type: Number,
          
        }
    }
)

const itemsSchema = new mongoose.Schema(
    {
        price: {
            type: priceSchema,
          
        },

        size: {
            type: String,
        }

    }
)

const sizesSchema = new mongoose.Schema(
    {
        size: {
            type: String,
            default: "large",
            required: true
        },

        url: {
            type: String,
            required: true
        }
    }
)

const imagesSchema = new mongoose.Schema(
    {
        perspective: {
            type: String,
            default: "front",
            required: true
        },

        sizes: [ sizesSchema ],
    }
)
const productSchema = new mongoose.Schema(
    {
        productId: {
            type: String,
            required: true
        },

        brand: {
            type: String,
            required: true
        },

        categories: {
            type: Array,
            required: true
        },

        description: {
            type: String,
            required: true
        },

        images: [ imagesSchema ],

        items: [ itemsSchema ]
    },
);

const ProductModel = mongoose.model('Product', productSchema);

const ProductController = {
    ProductModel,
};

module.exports = ProductController;