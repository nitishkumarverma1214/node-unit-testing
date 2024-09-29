const express = require('express');
const TodoController = require('../controllers/todo.controller');

const router = express.Router();

router.post('/',TodoController.createTodo);
router.get('/',TodoController.getTodo);
router.get('/:id',TodoController.getTodoById);

module.exports = router;