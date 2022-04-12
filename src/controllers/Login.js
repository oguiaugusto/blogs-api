require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');

const login = require('../services/Login');
const errors = require('../schemas/errors');
const httpCodes = require('../schemas/httpCodes');

const router = express.Router();
const { JWT_SECRET } = process.env;

router.post('/', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await login({ email, password });

    if (user.error) return next(user.error);
    
    const jwtConfig = { expiresIn: '1d', algorithm: 'HS256' };
    const token = jwt.sign({ data: user }, JWT_SECRET, jwtConfig);

    return res.status(httpCodes.OK).json({ token });
  } catch (error) {
    console.log(error.message);
    return next({ error: { code: httpCodes.INTERNAL_SERVER_ERROR, message: errors.internal } });
  }
});

module.exports = router;
