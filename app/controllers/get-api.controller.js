const db = require("../../db/connection");
const endpointsJson = require("../../endpoints.json");
const { selectApiTopics } = require("../models/get-api.model");

exports.getApi = (req, res) => {
  res.status(200).send({ endpoints: endpointsJson });
};

exports.getApiTopics = (req, res,) => {
  selectApiTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(() => {
      return res.status(500).send({ msg: "Internal Server Error" });
    });
};
