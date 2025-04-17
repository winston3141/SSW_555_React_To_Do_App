import { Todo } from "../App";
import TodoItem from "./TodoItem";
import "./TodoList.css";

interface TodoListProps {
  todos: Todo[];
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  updateTodo: (id: number, updatedText: string) => void;
}

const TodoList = ({
  todos,
  toggleTodo,
  deleteTodo,
  updateTodo,
}: TodoListProps) => {
  if (todos.length === 0) {
    return <p className="empty-message">No todos yet! Add one above.</p>;
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          toggleTodo={toggleTodo}
          deleteTodo={deleteTodo}
          updateTodo={updateTodo} // Pass updateTodo down to each TodoItem
        />
      ))}
    </ul>
  );
};

export default TodoList;
