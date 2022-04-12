require('dotenv').config();
const Joi = require('joi');

const { Users } = require('../models');
const errors = require('../schemas/errors');
const httpCodes = require('../schemas/httpCodes');

module.exports = async ({ email, password }) => {
  try {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().length(6).required(),
    }).validate({ email, password });
    if (schema.error) return { error: schema.error };

    const user = await Users.findOne({ where: { email, password } });
    if (!user) {
      return { error: { code: httpCodes.BAD_REQUEST, message: errors.login.invalidFields } };
    }

    return user;
  } catch (error) {
    console.log(error.message);
    return { error: { code: httpCodes.INTERNAL_SERVER_ERROR, message: errors.internal } };
  }
};
