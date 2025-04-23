import React, { useState, useEffect } from 'react';
import { Todo } from '../App';
import './TodoEditModal.css';

interface TodoEditModalProps {
  todo: Todo;
  onClose: () => void;
  onSave: (dueDate: string | undefined, dueTime: string | undefined) => void;
}

const TodoEditModal: React.FC<TodoEditModalProps> = ({ todo, onClose, onSave }) => {
  const [dueDate, setDueDate] = useState<string | undefined>(todo.dueDate);
  const [dueTime, setDueTime] = useState<string | undefined>(todo.dueTime);

  // Handle click outside modal to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('modal-overlay')) {
        onClose();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [onClose]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [onClose]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDueDate(e.target.value || undefined);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDueTime(e.target.value || undefined);
  };

  const handleClearDate = () => {
    setDueDate(undefined);
  };

  const handleClearTime = () => {
    setDueTime(undefined);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(dueDate, dueTime);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Edit Task</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="task-title">
              <p>{todo.text}</p>
            </div>
            
            <div className="form-group">
              <label htmlFor="dueDate">Due Date:</label>
              <div className="input-with-clear">
                <input
                  type="date"
                  id="dueDate"
                  value={dueDate || ''}
                  onChange={handleDateChange}
                />
                {dueDate && (
                  <button 
                    type="button" 
                    className="clear-btn" 
                    onClick={handleClearDate}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="dueTime">Due Time:</label>
              <div className="input-with-clear">
                <input
                  type="time"
                  id="dueTime"
                  value={dueTime || ''}
                  onChange={handleTimeChange}
                />
                {dueTime && (
                  <button 
                    type="button" 
                    className="clear-btn" 
                    onClick={handleClearTime}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
            
            <div className="modal-actions">
              <button type="button" className="cancel-btn" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="save-btn">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TodoEditModal; 