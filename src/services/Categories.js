const Joi = require('joi');

const { Categories } = require('../models');
const errors = require('../schemas/errors');
const httpCodes = require('../schemas/httpCodes');

const getInternalError = () => ({
  error: { code: httpCodes.INTERNAL_SERVER_ERROR, message: errors.internal },
});

const create = async ({ name }) => {
  try {
    const schema = Joi.object({ name: Joi.string().not().empty().required() }).validate({ name });
    if (schema.error) return { error: schema.error };

    const existingCategory = await Categories.findOne({ where: { name } });
    if (existingCategory) {
      return { error: { code: httpCodes.CONFLICT, message: errors.category.alreadyRegistered } };
    }

    const category = await Categories.create({ name });
    return category;
  } catch (error) {
    console.log(error.message);
    return getInternalError();
  }
};

const getAll = async () => {
  try {
    const categories = await Categories.findAll({ order: ['id'] });

    if (!categories) {
      return { error: { code: httpCodes.NOT_FOUND, message: errors.category.noCategoryFound } };
    }
    return categories;
  } catch (error) {
    console.log(error.message);
    return getInternalError();
  }
};

module.exports = {
  create,
  getAll,
};
