const Router = require('express');
const router = new Router();
const userRouter = require('./userRoutes');
const orderRouter = require('./orderRoutes');

router.use('/user', userRouter);
router.use('/order', orderRouter);

module.exports = router;
