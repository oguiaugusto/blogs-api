require('dotenv').config();
const express = require('express');

const Categories = require('../services/Categories');
const errors = require('../schemas/errors');
const httpCodes = require('../schemas/httpCodes');
const auth = require('../middlewares/auth');

const router = express.Router();
const getInternalError = (next) => (
  next({ code: httpCodes.INTERNAL_SERVER_ERROR, message: errors.internal })
);

router.post('/', auth, async (req, res, next) => {
  try {
    const { name } = req.body;
    const category = await Categories.create({ name });

    if (category.error) return next(category.error);
    return res.status(httpCodes.CREATED).json(category);
  } catch (error) {
    console.log(error.message);
    return getInternalError(next);
  }
});

module.exports = router;
