const db = require("../../db/connection");
const endpoints = require("../../endpoints.json");
// const {  } = require("../models/get-api.model");

exports.getApi = (req, res) => {
  res.status(200).send(endpoints);
};
