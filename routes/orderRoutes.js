const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');


router.post('/', orderController.createOrder);
router.post('/add',orderController.orderMake)
router.get('/:id', orderController.getCart);
router.post('/payment',orderController.paymentCart)
router.post('/delete/:id', orderController.deleteProduct);
router.post('/delete', orderController.deleteOrder);

module.exports = router;