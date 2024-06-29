const productService = require('../service/product');
const { dataHandle } = require('../middlewares/dataHandle');
const CONFIG_STATUS = require('../config/status.json');

const getAllProducts = async (req, res) => {
    const product_list = await productService.getAllProducts();
    dataHandle(product_list, req, res);
};

const getProductById = async (req, res) => {
    const { id } = req.params;
    const productDetail = await productService.getProductById(id);
    res.send({
        status: CONFIG_STATUS.SUCCESS,
        message: 'Get product successful.',
        data: productDetail
    });
}

const getProductByCode = async (req, res) => {
    const { code } = req.body;
    console.log(code)
    const productDetail = await productService.getProductByCode(code);
    res.send({
        status: CONFIG_STATUS.SUCCESS,
        message: 'Get product successful.',
        data: productDetail
    });
}

const createProduct = async (req, res) => {
    const { name, type, code, price, quantity, photo } = req.body;
    console.log(req.body)
    const newProduct = await productService.createProduct(name, type, code, price, quantity, photo);
    res.send({
        status: CONFIG_STATUS.SUCCESS,
        message: 'Create product successful.',
        data: newProduct,
    });
};

const updateProduct = async (req, res) => {
    const { _id } = req.params;
    const productData = req.body;
    const updatedProduct = await productService.updateProduct(_id, productData);
    res.send({
        status: CONFIG_STATUS.SUCCESS,
        message: 'Update product successful.',
        data: updatedProduct,
    });
};

const deleteProduct = async (req, res) => {
    const { id } = req.params;
    const deletedProduct = await productService.deleteProduct(id);
    res.send({
        status: CONFIG_STATUS.SUCCESS,
        message: 'Delete product successful.',
        data: deletedProduct,
    });
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductByCode
};
