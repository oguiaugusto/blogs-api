require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');

const Users = require('../services/Users');
const errors = require('../schemas/errors');
const httpCodes = require('../schemas/httpCodes');
const auth = require('../middlewares/auth');

const router = express.Router();
const { JWT_SECRET } = process.env;
const getInternalError = (next) => (
  next({ error: { code: httpCodes.INTERNAL_SERVER_ERROR, message: errors.internal } })
);

router.post('/', async (req, res, next) => {
  try {
    const { displayName, email, password, image } = req.body;
    const user = await Users.create({ displayName, email, password, image });

    if (user.error) return next(user.error);

    delete user.dataValues.password;
    const jwtConfig = { expiresIn: '1d', algorithm: 'HS256' };
    const token = jwt.sign({ data: user }, JWT_SECRET, jwtConfig);

    return res.status(httpCodes.CREATED).json({ token });
  } catch (error) {
    console.log(error.message);
    return getInternalError(next);
  }
});

router.get('/', auth, async (req, res, next) => {
  try {
    let users = await Users.getAll();

    if (users.error) return next(users.error);
    
    users = users.map((user) => {
      const newUser = user;
      delete newUser.dataValues.password;
      return newUser;
    });
    return res.status(httpCodes.OK).json(users);
  } catch (error) {
    console.log(error.message);
    return getInternalError(next);
  }
});

module.exports = router;
