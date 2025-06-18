import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const DEFAULT_MODEL = 'deepseek/deepseek-r1-0528-qwen3-8b';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, model = DEFAULT_MODEL, max_tokens = 1000, temperature = 0.7 } = req.body;
    const apiKey = req.headers.authorization?.split(' ')[1];

    if (!apiKey) {
      return res.status(401).json({ error: 'API key not configured' });
    }

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ 
        error: 'Invalid request', 
        details: 'Messages array is required' 
      });
    }

    const openai = new OpenAI({
      baseURL: 'https://api.novita.ai/v3/openai',
      apiKey,
    });

    const completion = await openai.chat.completions.create({
      model,
      messages,
      max_tokens,
      temperature,
    });

    // Return just the message content in a consistent format
    return res.status(200).json({
      role: completion.choices[0].message.role,
      content: completion.choices[0].message.content
    });
  } catch (error: any) {
    console.error('Error in chat completion:', error);
    let errMsg = 'Unknown error occurred';
    let errStatus: number | undefined = undefined;
    
    if (error?.message) {
      errMsg = error.message;
    }
    if (error?.status) {
      errStatus = error.status;
    }

    if (errStatus === 401 || errMsg.includes('auth')) {
      return res.status(401).json({ error: 'Invalid API key' });
    }
    if (errStatus === 429) {
      return res.status(429).json({ error: 'Rate limit exceeded' });
    }
    
    return res.status(500).json({ 
      error: 'Failed to get response from Novita AI',
      details: errMsg
    });
  }
} 