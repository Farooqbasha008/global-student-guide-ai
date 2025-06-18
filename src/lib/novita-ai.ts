// Default model for profile processing
const DEFAULT_MODEL = 'deepseek/deepseek-r1-0528-qwen3-8b';

// Model for chatbot
const CHATBOT_MODEL = 'qwen/qwen3-4b-fp8';

// Direct API URL for Novita AI
const API_URL = 'https://api.novita.ai/v3/openai/chat/completions';

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
  purpose?: 'chatbot' | 'profile';
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
        model: options.model || (options.purpose === 'chatbot' ? CHATBOT_MODEL : DEFAULT_MODEL),
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 1000,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.error?.message || 'Failed to get response from Novita AI';
      throw new Error(errorMessage);
    }

    // Extract the message from the OpenAI-compatible response format
    if (data.choices && data.choices.length > 0 && data.choices[0].message) {
      return {
        role: data.choices[0].message.role,
        content: data.choices[0].message.content
      };
    }
    
    throw new Error('Unexpected response format from Novita AI');
  } catch (error: unknown) {
    console.error('Error in sendChatCompletion:', error);
    let errMsg = 'Unknown error occurred';
    if (typeof error === 'object' && error !== null && 'message' in error && typeof (error as { message?: string }).message === 'string') {
      errMsg = (error as { message: string }).message;
    }
    throw new Error(errMsg);
  }
}