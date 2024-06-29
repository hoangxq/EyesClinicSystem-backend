const ProductInvoice = require('../model/productInvoice')
const invoiceService = require('../service/invoice')

// Function to create multiple product invoices
const createMultipleProductInvoices = async (productList, invoiceId) => {
    const productInvoices = productList.map(product => ({
        productId: product._id,
        invoiceId: invoiceId,
        quantity: product.quantity,
        total: product.price * product.quantity,
    }));

    // Insert product invoices into the database
    const createdProductInvoices = await ProductInvoice.insertMany(productInvoices);

    return createdProductInvoices; // Return the created product invoices

};

module.exports = {
    createMultipleProductInvoices,
};
