const express = require('express');
const Router = express.Router();
const TaskController = require('../controllers/TaskController');
const auth = require('../middleware/auth');

Router.get('/task', auth, TaskController.gettasks);
Router.get('/task/:id', auth, TaskController.gettask);
Router.post('/task', auth, TaskController.addtask);
Router.put('/task/:id', auth, TaskController.updatetask);
Router.delete('/task/:id', auth, TaskController.deletetask);

module.exports = Router;