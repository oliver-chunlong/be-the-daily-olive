const db = require("../../db/connection");
const endpoints = require("../../endpoints.json");
const {
  selectTopics,
  selectArticleById,
} = require("../models/get-api.model");

exports.getApi = (req, res) => {
  res.status(200).send({ endpoints });
};

exports.getTopics = (req, res) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(() => {
      return res.status(500).send({ msg: "Internal Server Error" });
    });
};

exports.getArticleById = (req, res) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((articles) => {
      return res.status(200).send({ articles });
    })
    .catch((err) => {
      if (err.code === "22P02") {
        return res.status(400).send({ msg: "Bad Request" });
      } else if (err.status && err.msg) {
        return res.status(err.status).send({ msg: err.msg });
      } else {
        return res.status(500).send({ msg: "Error: Internal Server" });
      }
    });
};
