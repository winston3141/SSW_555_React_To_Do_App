const mongoose = require('mongoose');

const todoListSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a list name'],
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    todos: [
      {
        text: {
          type: String,
          required: [true, 'Please add a todo text'],
          trim: true,
        },
        completed: {
          type: Boolean,
          default: false,
        },
        dueDate: {
          type: String,
          default: null,
        },
        dueTime: {
          type: String,
          default: null,
        },
        priority: {
          type: Boolean,
          default: false,
        },
        priorityTimestamp: {
          type: Number,
          default: null,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('TodoList', todoListSchema); 