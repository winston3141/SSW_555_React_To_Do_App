const TodoList = require('../models/todoModel');

// @desc    Get all user's todo lists
// @route   GET /api/todos
// @access  Private
const getTodoLists = async (req, res) => {
  try {
    const todoLists = await TodoList.find({ user: req.user._id });
    res.json(todoLists);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};

// @desc    Create a new todo list
// @route   POST /api/todos
// @access  Private
const createTodoList = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      res.status(400);
      throw new Error('Please provide a name for the todo list');
    }

    const todoList = await TodoList.create({
      name,
      user: req.user._id,
      todos: [],
    });

    res.status(201).json(todoList);
  } catch (error) {
    res.status(res.statusCode || 500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};

// @desc    Add a todo to a list
// @route   POST /api/todos/:id/items
// @access  Private
const addTodoItem = async (req, res) => {
  try {
    const { text } = req.body;
    const todoList = await TodoList.findById(req.params.id);

    if (!todoList) {
      res.status(404);
      throw new Error('Todo list not found');
    }

    // Check for user
    if (todoList.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized');
    }

    if (!text) {
      res.status(400);
      throw new Error('Please provide text for the todo item');
    }

    const todo = {
      text,
      completed: false,
      priority: false,
    };

    todoList.todos.push(todo);
    await todoList.save();

    res.status(201).json(todoList);
  } catch (error) {
    res.status(res.statusCode || 500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};

// @desc    Update a todo item
// @route   PUT /api/todos/:listId/items/:itemId
// @access  Private
const updateTodoItem = async (req, res) => {
  try {
    const { listId, itemId } = req.params;
    const { text, completed, dueDate, dueTime, priority } = req.body;

    const todoList = await TodoList.findById(listId);

    if (!todoList) {
      res.status(404);
      throw new Error('Todo list not found');
    }

    // Check for user
    if (todoList.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized');
    }

    // Find the todo item
    const todoItem = todoList.todos.id(itemId);

    if (!todoItem) {
      res.status(404);
      throw new Error('Todo item not found');
    }

    // Update fields if provided
    if (text !== undefined) todoItem.text = text;
    if (completed !== undefined) todoItem.completed = completed;
    if (dueDate !== undefined) todoItem.dueDate = dueDate;
    if (dueTime !== undefined) todoItem.dueTime = dueTime;
    
    if (priority !== undefined && priority !== todoItem.priority) {
      todoItem.priority = priority;
      todoItem.priorityTimestamp = priority ? Date.now() : null;
      
      // Sort todos if priority was toggled
      if (priority) {
        todoList.todos.sort((a, b) => {
          if (a.priority && !b.priority) return -1;
          if (!a.priority && b.priority) return 1;
          if (a.priority && b.priority) {
            return (b.priorityTimestamp || 0) - (a.priorityTimestamp || 0);
          }
          return 0;
        });
      }
    }

    await todoList.save();

    res.json(todoList);
  } catch (error) {
    res.status(res.statusCode || 500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};

// @desc    Delete a todo item
// @route   DELETE /api/todos/:listId/items/:itemId
// @access  Private
const deleteTodoItem = async (req, res) => {
  try {
    const { listId, itemId } = req.params;

    const todoList = await TodoList.findById(listId);

    if (!todoList) {
      res.status(404);
      throw new Error('Todo list not found');
    }

    // Check for user
    if (todoList.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized');
    }

    // Remove the todo item
    todoList.todos = todoList.todos.filter(
      (todo) => todo._id.toString() !== itemId
    );

    await todoList.save();

    res.json(todoList);
  } catch (error) {
    res.status(res.statusCode || 500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};

// @desc    Delete a todo list
// @route   DELETE /api/todos/:id
// @access  Private
const deleteTodoList = async (req, res) => {
  try {
    const todoList = await TodoList.findById(req.params.id);

    if (!todoList) {
      res.status(404);
      throw new Error('Todo list not found');
    }

    // Check for user
    if (todoList.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized');
    }

    await todoList.remove();

    res.json({ message: 'Todo list removed', listId: req.params.id });
  } catch (error) {
    res.status(res.statusCode || 500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};

module.exports = {
  getTodoLists,
  createTodoList,
  addTodoItem,
  updateTodoItem,
  deleteTodoItem,
  deleteTodoList,
}; 