const topicsRouter = require("express").Router();

topicsRouter.get("/", getTopics)