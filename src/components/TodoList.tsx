import { Todo } from '../App';
import TodoItem from './TodoItem';
import './TodoList.css';

interface TodoListProps {
  todos: Todo[];
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  updateTodoDateTime: (id: number, dueDate?: string, dueTime?: string) => void;
  togglePriority: (id: number) => void;
}

const TodoList = ({ todos, toggleTodo, deleteTodo, updateTodoDateTime, togglePriority }: TodoListProps) => {
  if (todos.length === 0) {
    return <p className="empty-message">No todos yet! Add one above.</p>;
  }
  
  return (
    <ul className="todo-list">
      {todos.map(todo => (
        <TodoItem 
          key={todo.id} 
          todo={todo} 
          toggleTodo={toggleTodo} 
          deleteTodo={deleteTodo}
          updateTodoDateTime={updateTodoDateTime}
          togglePriority={togglePriority}
        />
      ))}
    </ul>
  );
};

export default TodoList; 