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
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Interface for chat options
export interface ChatOptions {
  model?: string;
  maxTokens?: number;
  temperature?: number;
  stream?: boolean;
}

/**
 * Send a chat completion request to Novita AI
 * @param messages Array of chat messages
 * @param options Chat options
 * @param apiKey Optional API key to use instead of the environment variable
 * @returns Promise with the chat completion response
 */
export const sendChatCompletion = async (
  messages: ChatMessage[],
  options: ChatOptions = {},
  apiKey?: string
) => {
  const {
    model = DEFAULT_MODEL,
    maxTokens = 512,
    temperature = 0.7,
    stream = false
  } = options;

  try {
    const novitaClient = createNovitaClient(apiKey);
    const response = await novitaClient.chat.completions.create({
      model,
      messages,
      max_tokens: maxTokens,
      temperature,
      stream
    });

    return response;
  } catch (error) {
    console.error('Error calling Novita AI:', error);
    throw error;
  }
};