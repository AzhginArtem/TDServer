const { Order, Stock, OrderType, Currency } = require('../models/models');
const ApiError = require('../errors/ApiError');

class OrdersController {
  async getAll(req, res) {
    const { id } = req.body;
    const orders = await Order.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      where: { userId: id },
      include: [
        { model: Stock, attributes: ['name', 'img'] },
        { model: Currency, attributes: ['name'], as: 'currency1' },
        { model: Currency, attributes: ['name'], as: 'currency2' },
        { model: OrderType, attributes: ['name'] },
      ],
    }).then((all) => {
      for (let order in all) {
        all[order].stockId = all[order].stock.name;
      }
      return all;
    });
    return res.json(orders);
  }

  async create(req, res) {
    const { date, currency1, currency2, stock, userId, orderType, value, price, summary } =
      req.body;
    let currency1Id = await Currency.findOne({ where: { name: currency1 } });
    let currency2Id = await Currency.findOne({ where: { name: currency2 } });
    let stockId = await Stock.findOne({ where: { name: stock } });
    let orderTypeId = await OrderType.findOne({ where: { name: orderType } });
    currency1Id = currency1Id.id;
    currency2Id = currency2Id.id;
    stockId = stockId.id;
    orderTypeId = orderTypeId.id;
    const orders = await Order.create({
      date,
      value,
      price,
      summary,
      userId,
      currency1Id,
      currency2Id,
      stockId,
      orderTypeId,
    });
    res.json(orders);
  }

  async getAllStocks(req, res) {
    const stocks = await Stock.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt', 'img'] },
    });
    return res.json(stocks);
  }

  async getAllCurrencies(req, res) {
    const currencies = await Currency.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });
    return res.json(currencies);
  }
}

module.exports = new OrdersController();
