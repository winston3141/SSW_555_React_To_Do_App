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
import { todoApi } from './services/api'

export interface Todo {
  id: string | number;
  text: string;
  completed: boolean;
  dueDate?: string; // Optional date in ISO format
  dueTime?: string; // Optional time in HH:MM format
  priority: boolean; // Whether the task is prioritized
  priorityTimestamp?: number; // When the task was last prioritized (for FIFO ordering)
}

export interface TodoListType {
  id: string | number;
  name: string;
  todos: Todo[];
}

const AppContent = () => {
  const [todoLists, setTodoLists] = useState<TodoListType[]>([])
  const [currentListId, setCurrentListId] = useState<string | number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const { user, isAuthenticated, login, logout } = useContext(AuthContext)

  // Fetch todo lists from API when authenticated
  useEffect(() => {
    const fetchTodos = async () => {
      if (isAuthenticated) {
        setLoading(true)
        try {
          const lists = await todoApi.getTodoLists()
          if (lists.length > 0) {
            setTodoLists(lists)
            setCurrentListId(lists[0].id)
          } else {
            // Create a default list if none exists
            const defaultList = await todoApi.createTodoList('Main List')
            if (defaultList) {
              setTodoLists([defaultList])
              setCurrentListId(defaultList.id)
            }
          }
        } catch (error) {
          console.error('Error fetching todos:', error)
        } finally {
          setLoading(false)
        }
      }
    }

    if (isAuthenticated) {
      fetchTodos()
    }
  }, [isAuthenticated])

  const getCurrentList = () => {
    return todoLists.find(list => list.id === currentListId) || todoLists[0]
  }

  const addTodo = async (text: string) => {
    if (text.trim() && currentListId) {
      try {
        const listId = String(currentListId)
        const updatedList = await todoApi.addTodoItem(listId, text)
        
        if (updatedList) {
          setTodoLists(currentLists => 
            currentLists.map(list => 
              list.id === currentListId ? updatedList : list
            )
          )
        }
      } catch (error) {
        console.error('Error adding todo:', error)
      }
    }
  }

  const toggleTodo = async (id: string | number) => {
    const currentList = getCurrentList()
    if (!currentList) return
    
    const todo = currentList.todos.find(t => t.id === id)
    if (!todo) return
    
    try {
      const listId = String(currentList.id)
      const itemId = String(id)
      const updatedList = await todoApi.updateTodoItem(listId, itemId, {
        completed: !todo.completed
      })
      
      if (updatedList) {
        setTodoLists(currentLists => 
          currentLists.map(list => 
            list.id === currentListId ? updatedList : list
          )
        )
      }
    } catch (error) {
      console.error('Error toggling todo:', error)
    }
  }

  const deleteTodo = async (id: string | number) => {
    const currentList = getCurrentList()
    if (!currentList) return
    
    try {
      const listId = String(currentList.id)
      const itemId = String(id)
      const updatedList = await todoApi.deleteTodoItem(listId, itemId)
      
      if (updatedList) {
        setTodoLists(currentLists => 
          currentLists.map(list => 
            list.id === currentListId ? updatedList : list
          )
        )
      }
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }

  const updateTodoDateTime = async (id: string | number, dueDate?: string, dueTime?: string) => {
    const currentList = getCurrentList()
    if (!currentList) return
    
    try {
      const listId = String(currentList.id)
      const itemId = String(id)
      const updatedList = await todoApi.updateTodoItem(listId, itemId, {
        dueDate,
        dueTime
      })
      
      if (updatedList) {
        setTodoLists(currentLists => 
          currentLists.map(list => 
            list.id === currentListId ? updatedList : list
          )
        )
      }
    } catch (error) {
      console.error('Error updating todo date/time:', error)
    }
  }

  const togglePriority = async (id: string | number) => {
    const currentList = getCurrentList()
    if (!currentList) return
    
    const todo = currentList.todos.find(t => t.id === id)
    if (!todo) return
    
    try {
      const listId = String(currentList.id)
      const itemId = String(id)
      const updatedList = await todoApi.updateTodoItem(listId, itemId, {
        priority: !todo.priority
      })
      
      if (updatedList) {
        setTodoLists(currentLists => 
          currentLists.map(list => 
            list.id === currentListId ? updatedList : list
          )
        )
      }
    } catch (error) {
      console.error('Error toggling priority:', error)
    }
  }

  const createTodoList = async (name: string) => {
    try {
      const newList = await todoApi.createTodoList(name)
      if (newList) {
        setTodoLists(currentLists => [...currentLists, newList])
        setCurrentListId(newList.id)
      }
    } catch (error) {
      console.error('Error creating todo list:', error)
    }
  }

  const selectTodoList = (id: string | number) => {
    setCurrentListId(id)
  }

  const currentList = getCurrentList()

  // Show loading state
  if (loading && isAuthenticated) {
    return <div className="loading">Loading...</div>
  }

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