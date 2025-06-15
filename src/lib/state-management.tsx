import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { aiService } from './ai-service';
import { handleApiError } from './error-handler';

// Types
interface User {
  id: string;
  email: string;
  name: string;
  preferences: {
    theme: 'light' | 'dark';
    language: string;
    notifications: boolean;
  };
}

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: number;
}

interface Roadmap {
  id: string;
  title: string;
  description: string;
  steps: Array<{
    id: string;
    title: string;
    description: string;
    completed: boolean;
  }>;
  createdAt: number;
  updatedAt: number;
}

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  chatHistory: ChatMessage[];
  roadmaps: Roadmap[];
  theme: 'light' | 'dark';
}

// Action Types
type Action =
  | { type: 'SET_USER'; payload: User }
  | { type: 'CLEAR_USER' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_CHAT_MESSAGE'; payload: ChatMessage }
  | { type: 'CLEAR_CHAT_HISTORY' }
  | { type: 'ADD_ROADMAP'; payload: Roadmap }
  | { type: 'UPDATE_ROADMAP'; payload: Roadmap }
  | { type: 'DELETE_ROADMAP'; payload: string }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' };

// Initial State
const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  chatHistory: [],
  roadmaps: [],
  theme: 'light'
};

// Reducer
function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        error: null
      };
    case 'CLEAR_USER':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        chatHistory: [],
        roadmaps: []
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      };
    case 'ADD_CHAT_MESSAGE':
      return {
        ...state,
        chatHistory: [...state.chatHistory, action.payload]
      };
    case 'CLEAR_CHAT_HISTORY':
      return {
        ...state,
        chatHistory: []
      };
    case 'ADD_ROADMAP':
      return {
        ...state,
        roadmaps: [...state.roadmaps, action.payload]
      };
    case 'UPDATE_ROADMAP':
      return {
        ...state,
        roadmaps: state.roadmaps.map(roadmap =>
          roadmap.id === action.payload.id ? action.payload : roadmap
        )
      };
    case 'DELETE_ROADMAP':
      return {
        ...state,
        roadmaps: state.roadmaps.filter(roadmap => roadmap.id !== action.payload)
      };
    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload
      };
    default:
      return state;
  }
}

// Context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

// Provider Component
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('appState');
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      if (parsedState.user) {
        dispatch({ type: 'SET_USER', payload: parsedState.user });
      }
      if (parsedState.theme) {
        dispatch({ type: 'SET_THEME', payload: parsedState.theme });
      }
    }
  }, []);

  // Save state to localStorage on changes
  useEffect(() => {
    localStorage.setItem(
      'appState',
      JSON.stringify({
        user: state.user,
        theme: state.theme
      })
    );
  }, [state.user, state.theme]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom Hooks
export function useAppState() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppProvider');
  }
  return context;
}

export function useAuth() {
  const { state, dispatch } = useAppState();

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      // Mock login - replace with actual API call
      const user: User = {
        id: '1',
        email,
        name: 'Test User',
        preferences: {
          theme: 'light',
          language: 'en',
          notifications: true
        }
      };
      dispatch({ type: 'SET_USER', payload: user });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: handleApiError(error).message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = () => {
    dispatch({ type: 'CLEAR_USER' });
  };

  return {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    login,
    logout
  };
}

export function useChat() {
  const { state, dispatch } = useAppState();

  const sendMessage = async (content: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      // Add user message
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'user',
        content,
        timestamp: Date.now()
      };
      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: userMessage });

      // Get AI response
      const response = await aiService.generateText(content);

      // Add bot message
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response.text,
        timestamp: Date.now()
      };
      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: botMessage });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: handleApiError(error).message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const clearHistory = () => {
    dispatch({ type: 'CLEAR_CHAT_HISTORY' });
  };

  return {
    messages: state.chatHistory,
    isLoading: state.isLoading,
    error: state.error,
    sendMessage,
    clearHistory
  };
}

export function useRoadmaps() {
  const { state, dispatch } = useAppState();

  const createRoadmap = async (title: string, description: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      // Generate roadmap steps using AI
      const prompt = `Create a detailed roadmap for ${title}. ${description}`;
      const response = await aiService.generateText(prompt);
      const steps = JSON.parse(response.text);

      const roadmap: Roadmap = {
        id: Date.now().toString(),
        title,
        description,
        steps,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      dispatch({ type: 'ADD_ROADMAP', payload: roadmap });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: handleApiError(error).message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateRoadmap = (roadmap: Roadmap) => {
    dispatch({ type: 'UPDATE_ROADMAP', payload: roadmap });
  };

  const deleteRoadmap = (id: string) => {
    dispatch({ type: 'DELETE_ROADMAP', payload: id });
  };

  return {
    roadmaps: state.roadmaps,
    isLoading: state.isLoading,
    error: state.error,
    createRoadmap,
    updateRoadmap,
    deleteRoadmap
  };
}

export function useTheme() {
  const { state, dispatch } = useAppState();

  const toggleTheme = () => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    dispatch({ type: 'SET_THEME', payload: newTheme });
  };

  return {
    theme: state.theme,
    toggleTheme
  };
} 