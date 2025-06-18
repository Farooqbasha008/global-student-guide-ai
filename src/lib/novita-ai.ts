const DEFAULT_MODEL = 'deepseek/deepseek-r1-0528-qwen3-8b';

// Use a relative path since we're proxying through Vite
const API_URL = '/api/chat';

// Interface for chat message
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Interface for chat options
export interface ChatOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

// Interface for API error response
interface ApiErrorResponse {
  error: string;
  details?: string;
}

/**
 * Send a chat completion request to Novita AI
 * @param messages Array of chat messages
 * @param options Chat options
 * @returns Promise with the chat completion response
 */
export async function sendChatCompletion(
  messages: ChatMessage[],
  options: ChatOptions = {},
  apiKey?: string
): Promise<{ role: string; content: string }> {
  try {
    const apiKeyToUse = apiKey || import.meta.env.VITE_NOVITA_API_KEY;
    if (!apiKeyToUse) {
      throw new Error('API key is missing. Please provide a valid Novita AI API key.');
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKeyToUse}`
      },
      body: JSON.stringify({
        messages,
        model: options.model || DEFAULT_MODEL,
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 1000,
      }),
    });

    const text = await response.text();
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error('Invalid JSON response:', text);
      throw new Error('Invalid JSON response from server');
    }

    if (!response.ok) {
      const error = data as ApiErrorResponse;
      throw new Error(error.details || error.error || 'Failed to get response from server');
    }

    // Type guard for success response
    if (
      typeof data === 'object' && data !== null &&
      'role' in data && typeof (data as any).role === 'string' &&
      'content' in data && typeof (data as any).content === 'string'
    ) {
      return data as { role: string; content: string };
    }
    throw new Error('Unexpected response format from server');
  } catch (error) {
    console.error('Error in sendChatCompletion:', error);
    throw error;
  }
}