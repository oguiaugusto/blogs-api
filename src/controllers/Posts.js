require('dotenv').config();
const express = require('express');

const Posts = require('../services/Posts');
const errors = require('../schemas/errors');
const httpCodes = require('../schemas/httpCodes');
const auth = require('../middlewares/auth');

const router = express.Router();
const getInternalError = (next) => (
  next({ code: httpCodes.INTERNAL_SERVER_ERROR, message: errors.internal })
);

router.post('/', auth, async (req, res, next) => {
  try {
    const { body: { title, content, categoryIds }, user: { id: userId } } = req;
    const post = await Posts.create({ title, content, categoryIds, userId });

    if (post.error) return next(post.error);
    return res.status(httpCodes.CREATED).json(post);
  } catch (error) {
    console.log(error.message);
    return getInternalError(next);
  }
});

router.get('/', auth, async (req, res, next) => {
  try {
    const posts = await Posts.getAll();

    if (posts.error) return next(posts.error);
    return res.status(httpCodes.OK).json(posts);
  } catch (error) {
    console.log(error.message);
    return getInternalError(next);
  }
});

router.get('/search', auth, async (req, res, next) => {
  try {
    const { q: searchTerm } = req.query;
    const posts = await Posts.getAll(searchTerm);

    if (posts.error) return next(posts.error);
    return res.status(httpCodes.OK).json(posts);
  } catch (error) {
    console.log(error.message);
    return getInternalError(next);
  }
});

router.get('/:id', auth, async (req, res, next) => {
  try {
    const post = await Posts.getById(req.params.id);

    if (post.error) return next(post.error);
    return res.status(httpCodes.OK).json(post);
  } catch (error) {
    console.log(error.message);
    return getInternalError(next);
  }
});

router.put('/:id', auth, async (req, res, next) => {
  try {
    const { body: { title, content, categoryIds }, user: { id: userId }, params: { id } } = req;
    const post = await Posts.update({ title, categoryIds, content, id, userId });

    if (post.error) return next(post.error);
    return res.status(httpCodes.OK).json(post);
  } catch (error) {
    console.log(error.message);
    return getInternalError(next);
  }
});

router.delete('/:id', auth, async (req, res, next) => {
  try {
    const { params: { id }, user: { id: userId } } = req;
    const post = await Posts.remove({ id, userId });

    if (post.error) return next(post.error);
    return res.status(httpCodes.NO_CONTENT).end();
  } catch (error) {
    console.log(error.message);
    return getInternalError(next);
  }
});

module.exports = router;
