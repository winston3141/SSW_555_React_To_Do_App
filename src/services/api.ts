import { Todo, TodoListType } from '../App';
import { API_BASE_URL, DEFAULT_PORT, FALLBACK_PORTS } from './config';

// Helper to check if the server is running on a given port
const checkServerAvailability = async (port: number): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}:${port}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};

// Helper to get auth token from localStorage
const getToken = () => {
  const userInfo = localStorage.getItem('userInfo');
  return userInfo ? JSON.parse(userInfo).token : null;
};

// Common headers with auth token
const getHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

// Convert backend todo list format to frontend format
const convertFromBackend = (backendList: any): TodoListType => {
  return {
    id: backendList._id,
    name: backendList.name,
    todos: backendList.todos.map((todo: any) => ({
      id: todo._id,
      text: todo.text,
      completed: todo.completed,
      dueDate: todo.dueDate,
      dueTime: todo.dueTime,
      priority: todo.priority,
      priorityTimestamp: todo.priorityTimestamp,
    })),
  };
};

// Class to manage API endpoint discovery
class ApiService {
  private activePort: number = DEFAULT_PORT;
  private isInitialized: boolean = false;
  
  // Initialize by detecting the active port
  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    // Try the default port first
    if (await checkServerAvailability(DEFAULT_PORT)) {
      this.activePort = DEFAULT_PORT;
      this.isInitialized = true;
      return;
    }
    
    // Try fallback ports
    for (const port of FALLBACK_PORTS) {
      if (await checkServerAvailability(port)) {
        this.activePort = port;
        this.isInitialized = true;
        console.log(`API server found on port ${port}`);
        return;
      }
    }
    
    console.warn('Could not find API server on any expected port');
    this.activePort = DEFAULT_PORT; // Use default as fallback
    this.isInitialized = true;
  }
  
  // Get the full API URL
  getApiUrl(): string {
    return `${API_BASE_URL}:${this.activePort}/api`;
  }
  
  // Reset initialization to force rediscovery
  reset() {
    this.isInitialized = false;
  }
}

// Singleton instance
const apiService = new ApiService();

// API methods
export const todoApi = {
  // Get all todo lists
  async getTodoLists(): Promise<TodoListType[]> {
    await apiService.initialize();
    
    try {
      const response = await fetch(`${apiService.getApiUrl()}/todos`, {
        method: 'GET',
        headers: getHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch todo lists');
      }
      
      const data = await response.json();
      return data.map(convertFromBackend);
    } catch (error) {
      console.error('Error fetching todo lists:', error);
      return [];
    }
  },
  
  // Create a new todo list
  async createTodoList(name: string): Promise<TodoListType | null> {
    await apiService.initialize();
    
    try {
      const response = await fetch(`${apiService.getApiUrl()}/todos`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ name }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create todo list');
      }
      
      const data = await response.json();
      return convertFromBackend(data);
    } catch (error) {
      console.error('Error creating todo list:', error);
      return null;
    }
  },
  
  // Add a todo item to a list
  async addTodoItem(listId: string, text: string): Promise<TodoListType | null> {
    await apiService.initialize();
    
    try {
      const response = await fetch(`${apiService.getApiUrl()}/todos/${listId}/items`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ text }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add todo item');
      }
      
      const data = await response.json();
      return convertFromBackend(data);
    } catch (error) {
      console.error('Error adding todo item:', error);
      return null;
    }
  },
  
  // Update a todo item
  async updateTodoItem(
    listId: string, 
    itemId: string, 
    updates: {
      text?: string;
      completed?: boolean;
      dueDate?: string;
      dueTime?: string;
      priority?: boolean;
    }
  ): Promise<TodoListType | null> {
    await apiService.initialize();
    
    try {
      const response = await fetch(`${apiService.getApiUrl()}/todos/${listId}/items/${itemId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update todo item');
      }
      
      const data = await response.json();
      return convertFromBackend(data);
    } catch (error) {
      console.error('Error updating todo item:', error);
      return null;
    }
  },
  
  // Delete a todo item
  async deleteTodoItem(listId: string, itemId: string): Promise<TodoListType | null> {
    await apiService.initialize();
    
    try {
      const response = await fetch(`${apiService.getApiUrl()}/todos/${listId}/items/${itemId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete todo item');
      }
      
      const data = await response.json();
      return convertFromBackend(data);
    } catch (error) {
      console.error('Error deleting todo item:', error);
      return null;
    }
  },
  
  // Delete a todo list
  async deleteTodoList(listId: string): Promise<boolean> {
    await apiService.initialize();
    
    try {
      const response = await fetch(`${apiService.getApiUrl()}/todos/${listId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete todo list');
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting todo list:', error);
      return false;
    }
  },
}; 