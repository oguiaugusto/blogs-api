require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');

const Users = require('../services/Users');
const errors = require('../schemas/errors');
const httpCodes = require('../schemas/httpCodes');

const router = express.Router();
const { JWT_SECRET } = process.env;

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
    return next({ error: { code: httpCodes.INTERNAL_SERVER_ERROR, message: errors.internal } });
  }
});

module.exports = router;
