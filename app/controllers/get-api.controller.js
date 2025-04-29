const db = require("../../db/connection");
const endpoints = require("../../endpoints.json");
const {
  selectTopics,
  selectArticleById,
  fetchArticles,
  fetchCommsByArtId,
  insertCommByArtId,
} = require("../models/get-api.model");

exports.getApi = (req, res) => {
  res.status(200).send({ endpoints });
};

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((articles) => {
      return res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  fetchArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getCommsByArtId = (req, res, next) => {
  const { article_id } = req.params;

  fetchCommsByArtId(article_id)
    .then((comments) => {
      return res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommByArtId = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  insertCommByArtId(article_id, username, body)
    .then((comment) => {
      return res.status(201).send({ comment });
    })
    .catch(next);
};
