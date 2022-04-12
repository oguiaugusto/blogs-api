const Joi = require('joi');
const { Sequelize } = require('sequelize');
const config = require('../config/config');

const { BlogPosts, Categories, PostsCategories, Users } = require('../models');
const errors = require('../schemas/errors');
const httpCodes = require('../schemas/httpCodes');

const sequelize = new Sequelize(
  process.env.NODE_ENV === 'test' ? config.test : config.development,
);

const getInternalError = () => ({
  error: { code: httpCodes.INTERNAL_SERVER_ERROR, message: errors.internal },
});
const getCreateTransaction = async ({ title, content, categoryIds, userId }) => {
  const transactionResult = await sequelize.transaction(async (transaction) => {
    const now = new Date().toJSON();

    const post = await BlogPosts.create(
      { userId, title, content, published: now, updated: now },
      { transaction },
    );
    await Promise.all(
      categoryIds.map((categoryId) => PostsCategories.create(
        { postId: post.dataValues.id, categoryId },
        { transaction },
      )),
    );

    return post;
  });
  return transactionResult;
};

const create = async ({ title, content, categoryIds, userId }) => {
    try {
    const schema = Joi.object({
      title: Joi.string().not().empty().required(),
      content: Joi.string().not().empty().required(),
      categoryIds: Joi.array().not().empty().required(),
    }).validate({ title, content, categoryIds });
    if (schema.error) return { error: schema.error };

    const allCategoriesId = (await Categories.findAll()).map((c) => c.dataValues.id);

    if (!categoryIds.every((id) => allCategoriesId.includes(id))) {
      return { error: { code: httpCodes.BAD_REQUEST, message: errors.posts.categoryIdsNotFound } };
    }
    
    const transactionResult = await getCreateTransaction({ title, content, categoryIds, userId });
    delete transactionResult.dataValues.published; delete transactionResult.dataValues.updated;

    return transactionResult;
  } catch (error) {
    console.log(error.message);
    return getInternalError();
  }
};

const getAll = async () => {
  try {
    const posts = await BlogPosts.findAll({
      include: [
        { model: Users, as: 'user', attributes: { exclude: ['password'] } },
        { model: Categories, as: 'categories', through: { attributes: [] } },
      ],
    });

    if (!posts) return { error: { code: httpCodes.NOT_FOUND, message: errors.posts.notFound } };
    return posts;
  } catch (error) {
    console.log(error.message);
    return getInternalError();
  }
};

const getById = async (id) => {
  try {
    const post = await BlogPosts.findOne({
      where: { id },
      include: [
        { model: Users, as: 'user', attributes: { exclude: ['password'] } },
        { model: Categories, as: 'categories', through: { attributes: [] } },
      ],
    });

    if (!post) return { error: { code: httpCodes.NOT_FOUND, message: errors.posts.doesNotExist } };
    return post;
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
