import React, { useState } from 'react';
import { Todo } from '../App';
import './TodoItem.css';
import TodoEditModal from './TodoEditModal';

interface TodoItemProps {
  todo: Todo;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  updateTodoDateTime: (id: number, dueDate?: string, dueTime?: string) => void;
  togglePriority: (id: number) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ 
  todo, 
  toggleTodo, 
  deleteTodo,
  updateTodoDateTime,
  togglePriority
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Format due date and time for display
  const formatDueDate = () => {
    if (!todo.dueDate) return null;
    
    const date = new Date(todo.dueDate);
    return date.toLocaleDateString();
  };

  return (
    <>
      <li className={`todo-item ${todo.completed ? 'completed' : ''} ${todo.priority ? 'priority' : ''}`}>
        <div className="todo-content">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => toggleTodo(todo.id)}
          />
          <div className="todo-info">
            <span className="todo-text">{todo.text}</span>
            {(todo.dueDate || todo.dueTime) && (
              <div className="todo-due">
                {todo.dueDate && (
                  <span className="todo-due-date">
                    Due: {formatDueDate()}
                    {todo.dueTime && ` at ${todo.dueTime}`}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="todo-actions">
          <button 
            className={`priority-btn ${todo.priority ? 'active' : ''}`} 
            onClick={() => togglePriority(todo.id)}
            title={todo.priority ? "Remove priority" : "Mark as priority"}
          >
            !
          </button>
          <button className="edit" onClick={openModal}>
            Edit
          </button>
          <button 
            className="delete" 
            onClick={() => deleteTodo(todo.id)}
          >
            Delete
          </button>
        </div>
      </li>

      {isModalOpen && (
        <TodoEditModal
          todo={todo}
          onClose={closeModal}
          onSave={(dueDate: string | undefined, dueTime: string | undefined) => {
            updateTodoDateTime(todo.id, dueDate, dueTime);
            closeModal();
          }}
        />
      )}
    </>
  );
};

export default TodoItem; 