const {createProduct,fetchAllProducts, fetchProductById, updateProduct, deleteProduct} = require('../controllers/ProductController.js')
const express = require('express');
const { isLoggedIn } = require('../middleware/Auth');

const router = express.Router();


router.post('/', isLoggedIn,createProduct);
router.get('/' ,isLoggedIn,  fetchAllProducts);
router.get('/:id' , isLoggedIn, fetchProductById);
router.patch('/:id' ,isLoggedIn,  updateProduct);
router.delete('/deleteProduct' ,isLoggedIn,  deleteProduct);


module.exports = router;
