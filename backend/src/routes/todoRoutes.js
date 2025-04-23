const express = require('express');
const router = express.Router();
const {
  getTodoLists,
  createTodoList,
  addTodoItem,
  updateTodoItem,
  deleteTodoItem,
  deleteTodoList,
} = require('../controllers/todoController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

// Todo list routes
router.route('/')
  .get(getTodoLists)
  .post(createTodoList);

router.route('/:id')
  .delete(deleteTodoList);

// Todo item routes
router.route('/:id/items')
  .post(addTodoItem);

router.route('/:listId/items/:itemId')
  .put(updateTodoItem)
  .delete(deleteTodoItem);

module.exports = router; 