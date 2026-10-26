import http from 'http';
import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// 1. Top-Level Request Deserialization (Ordering Guarantee)
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// Dynamic Server-side Gemini Client helper
function getGeminiClient(): GoogleGenAI {
  dotenv.config();
  const currentKey = process.env.GEMINI_API_KEY || '';
  return new GoogleGenAI({
    apiKey: currentKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Resilient Model Fallback Ladder
const MODEL_FALLBACK_LADDER = [
  'gemini-3.6-flash',
  'gemini-3.1-flash-lite',
  'gemini-flash-latest',
  'gemini-3.7-flash',
];

interface FallbackOptions {
  contents: any;
  config?: any;
}

/**
 * Standard helper implementing resilient model fallback ladder
 */
async function generateContentWithFallback(options: FallbackOptions) {
  dotenv.config();
  const key = process.env.GEMINI_API_KEY;
  if (!key || !key.trim()) {
    throw new Error('GEMINI_API_KEY is not configured. Please add your key to the .env file in the project root.');
  }

  const ai = getGeminiClient();
  let lastError: any = null;

  for (const model of MODEL_FALLBACK_LADDER) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: options.contents,
        config: options.config,
      });

      if (response && response.text) {
        return { text: response.text, modelUsed: model };
      }
    } catch (err: any) {
      lastError = err;
      const status = err?.status || err?.statusCode || 0;
      const msg = err?.message || '';
      console.warn(`[Gemini Fallback] Model ${model} failed with status ${status}: ${msg}. Attempting next model...`);
      // Continue to next model in ladder
    }
  }

  throw lastError || new Error('All fallback models exhausted without response');
}

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Generate dynamic CSCA Practice Questions
app.post('/api/ai/generate-questions', async (req: Request, res: Response) => {
  try {
    // Defensive payload ingestion
    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const subject = typeof body.subject === 'string' ? body.subject : 'Mathematics';
    const topic = typeof body.topic === 'string' ? body.topic : 'General';
    const count = Math.min(Math.max(Number(body.count) || 3, 1), 10);
    const difficulty = typeof body.difficulty === 'string' ? body.difficulty : 'Medium';
    const language = body.language === 'zh' ? 'Chinese' : 'English & Chinese';

    const systemPrompt = `You are a senior exam writer and expert curriculum designer for the official China Scholastic Competency Assessment (CSCA / 中国学术水平能力测试), organized by the China Scholarship Council (CSC).
CSCA is a rigorous standardized examination for international students pursuing undergraduate degrees in China.
Follow the official 2025 CSCA Syllabus:
- Mathematics: Sets & Inequalities, Functions, Geometry & Algebra (conics, vectors, complex numbers, 3D), Probability & Statistics.
- Physics: Mechanics, Electromagnetism, Thermodynamics, Optics, Modern Physics.
- Chemistry: Basic Chemical Concepts and Calculations, Properties and Reactions of Substances, Chemical Theories and Laws, Chemical Experiments and Applications.
- Professional Chinese: Science and Engineering or Humanities terminology, academic reading comprehension, grammatical accuracy.

Create ${count} authentic CSCA multiple choice questions (single answer, 4 options: A, B, C, D).
Target Subject: ${subject}
Specific Topic/Module: ${topic}
Difficulty: ${difficulty}
Language: ${language}

Return valid JSON adhering to the specified schema: an array of questions.
Each question MUST have:
- id: unique string
- subject: "${subject}"
- module: syllabus module name
- question: question stem (if bilingual, provide English followed by Chinese)
- options: array of 4 distinct choices [ "A. ...", "B. ...", "C. ...", "D. ..." ]
- correctOption: index (0 for A, 1 for B, 2 for C, 3 for D)
- explanation: comprehensive, step-by-step solution explaining why the correct choice is right and common mistakes in other choices.
- formula: key chemical formula, math formula, or concept involved.`;

    const userPrompt = `Generate ${count} original, high-quality CSCA practice questions for subject "${subject}" on topic "${topic}". Ensure questions are challenging, academically accurate according to Chinese university entrance standards for international scholars, and formatted cleanly.`;

    const responseSchema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          subject: { type: Type.STRING },
          module: { type: Type.STRING },
          question: { type: Type.STRING },
          options: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          correctOption: { type: Type.INTEGER },
          explanation: { type: Type.STRING },
          formula: { type: Type.STRING },
        },
        required: ['id', 'subject', 'module', 'question', 'options', 'correctOption', 'explanation'],
      },
    };

    const result = await generateContentWithFallback({
      contents: [
        { role: 'user', parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] },
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema,
        temperature: 0.6,
      },
    });

    const parsed = JSON.parse(result.text);
    return res.json({
      success: true,
      modelUsed: result.modelUsed,
      questions: parsed,
    });
  } catch (error: any) {
    console.error('Error generating CSCA questions:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Failed to generate practice questions',
    });
  }
});

// Explain or tutor on a specific question
app.post('/api/ai/explain', async (req: Request, res: Response) => {
  try {
    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const question = typeof body.question === 'string' ? body.question : '';
    const selectedOption = typeof body.selectedOption === 'string' ? body.selectedOption : '';
    const correctOption = typeof body.correctOption === 'string' ? body.correctOption : '';
    const subject = typeof body.subject === 'string' ? body.subject : 'General';
    const userQuery = typeof body.userQuery === 'string' ? body.userQuery : '';

    if (!question) {
      return res.status(400).json({ success: false, error: 'Question content is required' });
    }

    const prompt = `You are the master CSCA tutor from the China Scholarship Council assessment board.
A student is practicing for the ${subject} exam.
Question: "${question}"
Candidate Selected: "${selectedOption}"
Correct Answer: "${correctOption}"
Student Specific Question/Confusion: "${userQuery || 'Please explain the complete solution and why each wrong answer is a distractor.'}"

Provide a structured, encouraging, and pedagogically sound explanation:
1. Core Concept & 2025 Syllabus Mapping
2. Step-by-Step Derivation / Reasoning
3. Why the correct answer is unambiguous
4. Distractor Analysis: Why the other options are wrong
5. Exam Strategy & Shortcut / Formula Tip`;

    const result = await generateContentWithFallback({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        temperature: 0.5,
      },
    });

    return res.json({
      success: true,
      explanation: result.text,
      modelUsed: result.modelUsed,
    });
  } catch (error: any) {
    console.error('Error providing AI explanation:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Failed to retrieve AI explanation',
    });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  const httpServer = http.createServer(app);

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: {
          server: httpServer,
        },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`[CSCA Assessment Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
