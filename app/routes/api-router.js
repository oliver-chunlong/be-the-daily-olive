const apiRouter = require("express").Router();
const {
  getApi,
  getTopics,
  getArticleById,
  getArticles,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchArticleById,
  deleteCommentById,
  getUsers,
} = require("../controllers/the-daily-olive.controller");
const usersRouter = require("./users-router");

apiRouter.get("/", getUsers);

apiRouter.use('/users', usersRouter);

module.exports = apiRouter