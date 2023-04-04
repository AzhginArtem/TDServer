const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const User = sequelize.define('user', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  fio: { type: DataTypes.STRING, unique: true },
  login: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING, unique: true },
  phone: { type: DataTypes.STRING, unique: true },
  role: { type: DataTypes.STRING, defaultValue: 'user' },
});

const Currency = sequelize.define('currency', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true },
});

const Stock = sequelize.define('stock', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true },
  img: { type: DataTypes.STRING, unique: true },
});

const OrderType = sequelize.define('orderType', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true },
});

const Order = sequelize.define('order', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  date: { type: DataTypes.DATEONLY },
  value: { type: DataTypes.INTEGER },
  price: { type: DataTypes.INTEGER },
  summary: { type: DataTypes.INTEGER },
});

User.hasOne(Order);
Order.belongsTo(User);

Order.belongsTo(Currency, { as: 'currency1' });
Order.belongsTo(Currency, { as: 'currency2' });

Stock.hasOne(Order);
Order.belongsTo(Stock);

OrderType.hasOne(Order);
Order.belongsTo(OrderType);

module.exports = { User, Order, OrderType, Stock, Currency };
