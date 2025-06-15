import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const DEFAULT_MODEL = 'deepseek/deepseek-r1-0528-qwen3-8b';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, model = DEFAULT_MODEL, max_tokens = 1000, temperature = 0.7 } = body;
    const apiKey = process.env.VITE_NOVITA_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured', details: 'Please set VITE_NOVITA_API_KEY in your environment variables' },
        { status: 500 }
      );
    }

    const openai = new OpenAI({
      baseURL: 'https://api.novita.ai/v3/openai',
      apiKey: apiKey,
    });

    const completion = await openai.chat.completions.create({
      model,
      messages,
      max_tokens,
      temperature,
    });

    return NextResponse.json(completion.choices[0].message);
  } catch (error: any) {
    console.error('Error in chat completion:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get response from Novita AI',
        details: error.message || 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
} 