const Router = require('express');
const OrdersController = require('../controllers/ordersController');
const router = new Router();

router.post('/', OrdersController.getAll);
router.post('/create', OrdersController.create);
router.get('/stocks', OrdersController.getAllStocks);
router.get('/currencies', OrdersController.getAllCurrencies);

module.exports = router;
