const {addToCart, fetchCartByUser, updateItemsInCart, deleteCart} = require('../controllers/CartController.js')
const express = require('express');
const { isLoggedIn } = require('../middleware/Auth');

const router = express.Router();

router.get('/',isLoggedIn, fetchCartByUser);
router.post('/',isLoggedIn, addToCart);
router.delete('/:itemId',isLoggedIn, deleteCart)
router.patch('/:productId',isLoggedIn, updateItemsInCart)


module.exports = router;
