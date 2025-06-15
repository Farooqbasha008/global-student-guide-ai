import OpenAI from 'openai';

// Initialize the OpenAI client with Novita AI's base URL
const createNovitaClient = (apiKey: string) => {
  return new OpenAI({
    baseURL: 'https://corsproxy.io/?url=' + encodeURIComponent('https://api.novita.ai/v3/openai'),
    apiKey: apiKey || import.meta.env.VITE_NOVITA_API_KEY || '',
    dangerouslyAllowBrowser: true
  });
};

// Default model to use
const DEFAULT_MODEL = 'deepseek/deepseek-r1-0528-qwen3-8b';

// Interface for chat message
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Interface for chat options
export interface ChatOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

/**
 * Send a chat completion request to Novita AI
 * @param messages Array of chat messages
 * @param options Chat options
 * @returns Promise with the chat completion response
 */
export async function sendChatCompletion(
  messages: ChatMessage[],
  options: ChatOptions = {}
): Promise<string> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        model: options.model || DEFAULT_MODEL,
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || 'Failed to get response from server');
    }

    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error('Error in sendChatCompletion:', error);
    throw error;
  }
}