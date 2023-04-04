const ApiError = require('../errors/ApiError');
const { User } = require('../models/models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UserController {
  async registration(req, res, next) {
    const { fio, login, password, email, phone } = req.body;
    const role = 'user';
    const existing = await User.findOne({
      where: { [Op.or]: [{ login }, { fio }, { email }, { phone }] },
    });

    if (existing) {
      return next(ApiError.badRequest('Такой пользователь уже существует!'));
    }

    const encrypt = await bcrypt.hash(password, 8);
    const newUser = await User.create({ fio, login, password: encrypt, email, phone, role });

    const token = jwt.sign(
      {
        id: newUser.id,
        login: newUser.login,
        email: newUser.email,
        fio: newUser.fio,
        phone: newUser.phone,
      },
      process.env.TOKEN_KEY,
      {
        expiresIn: '24h',
      },
    );
    return res.json({ token });
  }

  async login(req, res, next) {
    const { login, password } = req.body;
    const user = await User.findOne({ where: { login } });
    if (!user) {
      return next(ApiError.internal('Пользователь с таким login не существует'));
    }
    let compare = bcrypt.compareSync(password, user.password);
    if (!compare) {
      return next(ApiError.internal('Неправильный пароль'));
    }
    const token = jwt.sign(
      {
        id: user.id,
        login: user.login,
        email: user.email,
        fio: user.fio,
        phone: user.phone,
      },
      process.env.TOKEN_KEY,
      {
        expiresIn: '24h',
      },
    );
    return res.json({ token });
  }

  async auth(req, res, next) {
    const token = jwt.sign(
      {
        id: req.user.id,
        login: req.user.login,
        email: req.user.email,
        fio: req.user.fio,
        phone: req.user.phone,
      },
      process.env.TOKEN_KEY,
      { expiresIn: '24h' },
    );
    return res.json({ token });
  }

  async change(req, res, next) {
    const { fio, login, password, email, phone, userid } = req.body;
    const existing = await User.findOne({
      where: { [Op.or]: [{ login }, { fio }, { email }, { phone }], [Op.not]: { id: userid } },
    });
    if (existing) {
      return next(ApiError.badRequest('Пользователь с такими данными уже существует!'));
    }
    const encrypt = await bcrypt.hash(password, 8);
    await User.update(
      {
        fio: fio,
        login: login,
        password: encrypt,
        email: email,
        phone: phone,
      },
      {
        where: { id: userid },
      },
    );
    const updated = await User.findOne({ where: { id: userid } });
    const token = jwt.sign(
      {
        id: updated.id,
        login: updated.login,
        email: updated.email,
        fio: updated.fio,
        phone: updated.phone,
      },
      process.env.TOKEN_KEY,
      {
        expiresIn: '24h',
      },
    );
    return res.json({ token });
  }
}

module.exports = new UserController();
