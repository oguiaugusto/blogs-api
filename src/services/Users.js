const Joi = require('joi');

const { Users } = require('../models');
const errors = require('../schemas/errors');
const httpCodes = require('../schemas/httpCodes');

const getInternalError = () => ({
  error: { code: httpCodes.INTERNAL_SERVER_ERROR, message: errors.internal },
});

const create = async ({ displayName, email, password, image }) => {
  try {
    const schema = Joi.object({
      displayName: Joi.string().min(8).required(),
      email: Joi.string().email().required(),
      password: Joi.string().length(6).required(),
    }).validate({ displayName, email, password });
    if (schema.error) return { error: schema.error };
  
    const existingEmail = await Users.findOne({ where: { email } });
    if (existingEmail) {
      return { error: { code: httpCodes.CONFLICT, message: errors.users.alreadyRegistered } };
    }

    const user = await Users.create({ displayName, email, password, image });
    delete user.dataValues.password;

    return user;
  } catch (error) {
    console.log(error.message);
    return getInternalError();
  }
};

const getAll = async () => {
  try {
    const users = await Users.findAll({ attributes: { exclude: ['password'] } });

    if (!users) return { error: { code: httpCodes.NOT_FOUND, message: errors.users.noUserFound } };
    return users;
  } catch (error) {
    console.log(error.message);
    return getInternalError();
  }
};

const getById = async (id) => {
  try {
    const user = await Users.findByPk(id, { attributes: { exclude: ['password'] } });

    if (!user) return { error: { code: httpCodes.NOT_FOUND, message: errors.users.doesNotExist } };
    return user;
  } catch (error) {
    console.log(error.message);
    return getInternalError();
  }
};

module.exports = {
  create,
  getAll,
  getById,
};
