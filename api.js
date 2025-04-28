const http = require("http");
const db = require("./db/connection");
const express = require("express");
const app = express();
const { getApi } = require("./app/controllers/get-api.controller");

app.use(express.json());

app.get("/api", getApi);

module.exports = app;
