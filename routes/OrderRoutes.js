const {addOrder, fetchOrderByUser, deleteOrder, updateOrder} = require('../controllers/OrderController.js')
const express = require('express');
const { isLoggedIn } = require('../middleware/auth.js');

const router = express.Router();

router.get('/own',isLoggedIn, fetchOrderByUser);
router.post('/',isLoggedIn, addOrder);
router.delete('/:orderId', isLoggedIn,deleteOrder)
router.patch('/:orderId',isLoggedIn, updateOrder)


module.exports = router;