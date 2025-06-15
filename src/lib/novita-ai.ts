import OpenAI from 'openai';

// Initialize the OpenAI client with Novita AI's base URL
const createNovitaClient = (apiKey: string) => {
  return new OpenAI({
    baseURL: 'https://corsproxy.io/?url=' + encodeURIComponent('https://api.novita.ai/v3/openai'),
    apiKey: apiKey || import.meta.env.VITE_NOVITA_API_KEY || '',
    dangerouslyAllowBrowser: true // Only for development, consider using a backend proxy in production
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

interface ChatCompletionOptions {
  temperature?: number;
  maxTokens?: number;
}

export async function sendStreamingChatCompletion(
  messages: ChatMessage[],
  options: ChatCompletionOptions = {},
  onChunk: (chunk: string) => void,
  apiKey?: string
): Promise<void> {
  try {
    const response = await fetch('https://api.novita.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey || process.env.REACT_APP_NOVITA_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 1024,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Failed to get response reader');
    }

    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim() !== '');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices[0]?.delta?.content;
            if (content) {
              onChunk(content);
            }
          } catch (e) {
            console.error('Error parsing chunk:', e);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error in chat completion:', error);
    throw error;
  }
}