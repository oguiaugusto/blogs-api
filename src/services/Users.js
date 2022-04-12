const Joi = require('joi');

const { Users } = require('../models');
const errors = require('../schemas/errors');
const httpCodes = require('../schemas/httpCodes');

const create = async ({ displayName, email, password, image }) => {
  try {
    const schema = Joi.object({
      displayName: Joi.string().min(8).required(),
      email: Joi.string().email().required(),
      password: Joi.string().length(6).required(),
    }).validate({ displayName, email, password });
    console.log(schema.error);
    if (schema.error) return { error: schema.error };
  
    const existingEmail = await Users.findOne({ where: { email } });
    if (existingEmail) {
      return { error: { code: httpCodes.CONFLICT, message: errors.users.alreadyRegistered } };
    }

    const user = await Users.create({ displayName, email, password, image });
    return user;
  } catch (error) {
    console.log(error.message);
    return { error: { code: httpCodes.INTERNAL_SERVER_ERROR, message: errors.internal } };
  }
};

module.exports = {
  create,
};
