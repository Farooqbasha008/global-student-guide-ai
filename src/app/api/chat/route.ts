import { type NextRequest } from 'next/server';
import OpenAI from 'openai';

const DEFAULT_MODEL = 'deepseek/deepseek-r1-0528-qwen3-8b';

export async function OPTIONS(req: NextRequest) {
  return Response.json(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, model = DEFAULT_MODEL, max_tokens = 1000, temperature = 0.7 } = body;
    const apiKey = req.headers.get('Authorization')?.split(' ')[1];

    if (!apiKey) {
      return Response.json(
        { error: 'API key not configured' },
        { status: 401 }
      );
    }

    if (!messages || !Array.isArray(messages)) {
      return Response.json(
        { error: 'Invalid request', details: 'Messages array is required' },
        { status: 400 }
      );
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
    return Response.json({
      role: completion.choices[0].message.role,
      content: completion.choices[0].message.content
    });
  } catch (error: unknown) {
    console.error('Error in chat completion:', error);
    let errMsg = 'Unknown error occurred';
    let errStatus: number | undefined = undefined;
    if (typeof error === 'object' && error !== null) {
      if ('message' in error && typeof (error as { message?: string }).message === 'string') {
        errMsg = (error as { message: string }).message;
      }
      if ('status' in error && typeof (error as { status?: number }).status === 'number') {
        errStatus = (error as { status: number }).status;
      }
    }
    if (errStatus === 401 || errMsg.includes('auth')) {
      return Response.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
    }
    if (errStatus === 429) {
      return Response.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }
    return Response.json(
      { 
        error: 'Failed to get response from Novita AI',
        details: errMsg
      },
      { status: 500 }
    );
  }
}