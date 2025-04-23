import { useState, useEffect, useContext } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import TodoList from './components/TodoList'
import TodoForm from './components/TodoForm'
import NavBar from './components/NavBar'
import Header from './components/Header'
import Register from './components/auth/Register'
import Login from './components/auth/Login'
import ProtectedRoute from './components/auth/ProtectedRoute'
import { AuthProvider, AuthContext } from './context/AuthContext'

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  dueDate?: string; // Optional date in ISO format
  dueTime?: string; // Optional time in HH:MM format
  priority: boolean; // Whether the task is prioritized
  priorityTimestamp?: number; // When the task was last prioritized (for FIFO ordering)
}

export interface TodoListType {
  id: number;
  name: string;
  todos: Todo[];
}

const AppContent = () => {
  const [todoLists, setTodoLists] = useState<TodoListType[]>([])
  const [currentListId, setCurrentListId] = useState<number>(0)
  const { user, isAuthenticated, login } = useContext(AuthContext)

  // Initialize with a default to-do list if none exists
  useEffect(() => {
    if (isAuthenticated && todoLists.length === 0) {
      const defaultList = {
        id: Date.now(),
        name: 'Main List',
        todos: []
      }
      setTodoLists([defaultList])
      setCurrentListId(defaultList.id)
    }
  }, [isAuthenticated, todoLists.length])

  const getCurrentList = () => {
    return todoLists.find(list => list.id === currentListId) || todoLists[0]
  }

  const addTodo = (text: string) => {
    if (text.trim()) {
      const newTodo: Todo = {
        id: Date.now(),
        text,
        completed: false,
        dueDate: undefined,
        dueTime: undefined,
        priority: false,
        priorityTimestamp: undefined
      }
      
      setTodoLists(currentLists => 
        currentLists.map(list => 
          list.id === currentListId 
            ? { ...list, todos: [...list.todos, newTodo] } 
            : list
        )
      )
    }
  }

  const toggleTodo = (id: number) => {
    setTodoLists(currentLists => 
      currentLists.map(list => 
        list.id === currentListId
          ? {
              ...list, 
              todos: list.todos.map(todo => 
                todo.id === id 
                  ? { ...todo, completed: !todo.completed } 
                  : todo
              )
            }
          : list
      )
    )
  }

  const deleteTodo = (id: number) => {
    setTodoLists(currentLists => 
      currentLists.map(list => 
        list.id === currentListId
          ? {
              ...list, 
              todos: list.todos.filter(todo => todo.id !== id)
            }
          : list
      )
    )
  }

  const updateTodoDateTime = (id: number, dueDate?: string, dueTime?: string) => {
    setTodoLists(currentLists => 
      currentLists.map(list => 
        list.id === currentListId
          ? {
              ...list, 
              todos: list.todos.map(todo => 
                todo.id === id 
                  ? { ...todo, dueDate, dueTime } 
                  : todo
              )
            }
          : list
      )
    )
  }

  const togglePriority = (id: number) => {
    setTodoLists(currentLists => 
      currentLists.map(list => 
        list.id === currentListId
          ? {
              ...list, 
              todos: list.todos.map(todo => 
                todo.id === id 
                  ? { 
                      ...todo, 
                      priority: !todo.priority,
                      priorityTimestamp: !todo.priority ? Date.now() : undefined
                    } 
                  : todo
              ).sort((a, b) => {
                // Sort logic: prioritized tasks at top, most recently prioritized first
                if (a.priority && !b.priority) return -1
                if (!a.priority && b.priority) return 1
                if (a.priority && b.priority) {
                  // If both are prioritized, sort by priority timestamp (most recent first)
                  return (b.priorityTimestamp || 0) - (a.priorityTimestamp || 0)
                }
                return 0
              })
            }
          : list
      )
    )
  }

  const createTodoList = (name: string) => {
    const newList = {
      id: Date.now(),
      name,
      todos: []
    }
    setTodoLists([...todoLists, newList])
    setCurrentListId(newList.id)
  }

  const selectTodoList = (id: number) => {
    setCurrentListId(id)
  }

  const currentList = getCurrentList()

  return (
    <Routes>
      <Route 
        path="/login" 
        element={!isAuthenticated ? <Login onLogin={login} /> : <Navigate to="/" />} 
      />
      <Route 
        path="/register" 
        element={!isAuthenticated ? <Register onRegister={login} /> : <Navigate to="/" />}
      />
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <>
              <Header />
              <div className="app-layout">
                <div className="sidebar">
                  <h2 className="sidebar-title">Todo Lists</h2>
                  <NavBar 
                    todoLists={todoLists}
                    currentListId={currentListId}
                    onSelectList={selectTodoList}
                    onCreateList={createTodoList}
                  />
                </div>
                <div className="main-content">
                  {currentList && (
                    <div className="app-container">
                      <div className="list-header">
                        <h2>{currentList.name}</h2>
                      </div>
                      <TodoForm addTodo={addTodo} />
                      <TodoList 
                        todos={currentList.todos} 
                        toggleTodo={toggleTodo} 
                        deleteTodo={deleteTodo}
                        updateTodoDateTime={updateTodoDateTime}
                        togglePriority={togglePriority}
                      />
                    </div>
                  )}
                </div>
              </div>
            </>
          </ProtectedRoute>
        } 
      />
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  )
}

export default App 