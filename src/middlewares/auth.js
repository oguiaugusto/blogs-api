require('dotenv').config();
const jwt = require('jsonwebtoken');

const { Users } = require('../models');
const errors = require('../schemas/errors');
const httpCodes = require('../schemas/httpCodes');

const { JWT_SECRET } = process.env;
const getInvalidError = (res) => (
  res.status(httpCodes.UNAUTHORIZED).json({ message: errors.token.expiredOrInvalid })
);

module.exports = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(httpCodes.UNAUTHORIZED).json({ message: errors.token.notFound });

  try {
    const { data } = jwt.verify(token, JWT_SECRET);
    const user = await Users.findOne({ where: { email: data.email, id: data.id } });

    if (!user) return getInvalidError(res);

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') return getInvalidError(res);

    console.log(error.message);
    return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({ message: errors.internal });
  }
};
