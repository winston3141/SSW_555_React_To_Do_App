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

// Authentication methods
export const authApi = {
  // Login user
  async login(email: string, password: string) {
    await apiService.initialize();
    
    const response = await fetch(`${apiService.getApiUrl()}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Invalid credentials');
    }
    
    return data;
  },
  
  // Register user
  async register(name: string, email: string, password: string) {
    await apiService.initialize();
    
    const response = await fetch(`${apiService.getApiUrl()}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    
    return data;
  },
}; 