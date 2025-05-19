const usersRouter = require("express").Router();

usersRouter.get("/", (req, res) => {
  res.status(200).send("All Ok from /api/users");
});

// usersRouter.get("/", (req, res) => {
//   res.status(200).send("All Ok from /api/users/:id");
// });

module.exports = usersRouter