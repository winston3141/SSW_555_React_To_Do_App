import React, { useState } from "react";
import { Todo } from "../App";
import "./TodoItem.css";

interface TodoItemProps {
  todo: Todo;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  updateTodo: (id: number, updatedText: string) => void; // Updated to remove priority
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  toggleTodo,
  deleteTodo,
  updateTodo,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(todo.text); // Holds the task text to be edited

  // Handle toggle to mark task as completed
  const handleToggle = () => {
    toggleTodo(todo.id);
  };

  // Handle editing task text
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  // Save the edited task text
  const handleSave = () => {
    if (editedText.trim() === "") {
      alert("Task description cannot be empty!");
      return;
    }
    updateTodo(todo.id, editedText); // Call updateTodo to save the edited task
    setIsEditing(false); // Exit edit mode
  };

  const handleDelete = (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (confirmDelete) {
      deleteTodo(id);
    }
  };
  return (
    <li className={`todo-item ${todo.completed ? "completed" : ""}`}>
      <div className="todo-content">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
        />
        {isEditing ? (
          <div>
            <input
              type="text"
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)} // Update the text as the user types
            />
            <button onClick={handleSave}>Save</button>
            <button onClick={handleEditToggle}>Cancel</button>
          </div>
        ) : (
          <span className="todo-text">{todo.text}</span> // Show the task text when not editing
        )}
      </div>
      <button className="delete" onClick={() => handleDelete(todo.id)}>
        Delete
      </button>
      {!isEditing && (
        <button className="edit" onClick={handleEditToggle}>
          Edit
        </button>
      )}
    </li>
  );
};

export default TodoItem;
