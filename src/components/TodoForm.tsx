import React, { useState } from "react";
import "./TodoForm.css";

interface TodoFormProps {
  addTodo: (text: string) => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ addTodo }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      addTodo(text); // Pass the input text to addTodo
      setText(""); // Clear the input field after adding the task
    } else {
      alert("Task description cannot be empty!"); // Alert for empty input
    }
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="todo-input"
        value={text}
        onChange={(e) => setText(e.target.value)} // Update the text as user types
        placeholder="Add a new todo..."
      />
      <button type="submit" disabled={!text.trim()}>
        Add
      </button>{" "}
      {/* Disable the button if input is empty */}
    </form>
  );
};
export default TodoForm;
