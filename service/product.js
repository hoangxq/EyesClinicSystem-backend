
const CONFIG_STATUS = require('../config/status.json');
const Product = require('../model/product');


const getAllProducts = async () => {
    const product_list = await Product.find();
    const total = await Product.countDocuments();
    return {
        product_list,
        meta_data: {
            length: product_list.length,
            total,
        },
    };
};
const createProduct = async (name, type, code, price, quantity, photo) => {
    const newProduct = new Product({
        name,
        type,
        code,
        price,
        quantity,
        photo,
    });

    const savedProduct = await newProduct.save();
    return {
        status: CONFIG_STATUS.SUCCESS,
        message: 'Product created successfully',
        data: savedProduct
    };
};


const getProductById = async (productId) => {
    const product = await Product.findById(productId);
    if (!product) {
        return {
            status: CONFIG_STATUS.FAIL,
            message: 'Product not found'
        };
    }
    return {
        status: SUCCESS,
        message: 'Product retrieved successfully',
        data: product
    };
};
const getProductByCode = async (productCode) => {
    const product = await Product.findOne({ code: productCode });
    if (!product) {
        return {
            status: CONFIG_STATUS.FAIL,
            message: 'Product not found'
        };
    }
    return {
        status: CONFIG_STATUS.SUCCESS,
        message: 'Product retrieved successfully',
        data: product
    };
};

const updateProduct = async (productId, productData) => {
    const updatedProduct = await Product.findByIdAndUpdate(productId, productData, { new: true });
    console.log(productData)
    console.log(productId)
    if (!updatedProduct) {
        return {
            status: CONFIG_STATUS.FAIL,
            message: 'Product not found or update failed'
        };
    }
    return {
        status: CONFIG_STATUS.SUCCESS,
        message: 'Product updated successfully',
        data: updatedProduct
    };
};

const deleteProduct = async (productId) => {
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
        return {
            status: CONFIG_STATUS.FAIL,
            message: 'Product not found or delete failed'
        };
    }
    return {
        status: CONFIG_STATUS.SUCCESS,
        message: 'Product deleted successfully',
        data: deletedProduct
    };
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getProductByCode
};
