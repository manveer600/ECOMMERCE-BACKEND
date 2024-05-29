const {addOrder, fetchOrderByUser, deleteOrder, updateOrder, fetchAllOrders} = require('../controllers/OrderController.js')
const express = require('express');
const { isLoggedIn } = require('../middleware/Auth');

const router = express.Router();

router.get('/own',isLoggedIn, fetchOrderByUser);
router.post('/',isLoggedIn, addOrder);
router.delete('/:orderId', isLoggedIn,deleteOrder)
router.patch('/:orderId',isLoggedIn, updateOrder)

router.get('/', isLoggedIn, fetchAllOrders)


module.exports = router;
