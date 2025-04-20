const express = require('express');
const Router = express.Router();
const UserController = require('../controllers/UserController');
const auth = require('../middleware/auth');

Router.post("/register", UserController.register);
Router.put("/user", auth, UserController.updateuser);
Router.post("/login", UserController.login);
Router.get("/user", auth, UserController.getuser);

module.exports = Router;