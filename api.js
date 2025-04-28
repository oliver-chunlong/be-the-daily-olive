const http = require("http");
const db = require("./db/connection");
const express = require("express");
const app = express();
const {
  getApi,
  getApiTopics,
} = require("./app/controllers/get-api.controller");

app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getApiTopics);

module.exports = app;
