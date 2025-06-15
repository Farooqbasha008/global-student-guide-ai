import express from 'express';
import cors from 'cors';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize OpenAI client
const openai = new OpenAI({
  baseURL: 'https://api.novita.ai/v3/openai',
  apiKey: process.env.VITE_NOVITA_API_KEY,
});

// Chat completion endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    const completion = await openai.chat.completions.create({
      model: 'deepseek/deepseek-r1-0528-qwen3-8b',
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    res.json(completion.choices[0].message);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: 'Failed to get response from Novita AI',
      details: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
