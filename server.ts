import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import {
  evaluateWritingResponse,
  evaluateSpeakingResponse,
  generateDiagnosticLearningPlan,
} from './src/services/ieltsCoreAIEngine.js';
import { askAriaTutor } from './src/services/ariaAITutor.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // ============================================================================
  // IELTS CORE AI ENGINE API ROUTES
  // ============================================================================

  // 1. [MODE: WRITING_EVALUATOR]
  app.post('/api/ielts-ai/evaluate-writing', async (req, res) => {
    try {
      const { taskType, taskPrompt, candidateEssay, model } = req.body;
      const result = await evaluateWritingResponse({
        taskType: taskType || 'Task 2',
        taskPrompt: taskPrompt || '',
        candidateEssay: candidateEssay || '',
        model: model || 'gemini-2.5-flash',
        apiKey: process.env.GEMINI_API_KEY,
      });
      res.json(result);
    } catch (err: any) {
      console.error('Error in /api/ielts-ai/evaluate-writing:', err);
      res.status(500).json({ error: 'EVALUATION_FAILED', message: err.message });
    }
  });

  // 2. [MODE: SPEAKING_EVALUATOR]
  app.post('/api/ielts-ai/evaluate-speaking', async (req, res) => {
    try {
      const { part, targetQuestion, candidateTranscript, model } = req.body;
      const result = await evaluateSpeakingResponse({
        part: part || 'Part 2',
        targetQuestion: targetQuestion || '',
        candidateTranscript: candidateTranscript || '',
        model: model || 'gemini-2.5-flash',
        apiKey: process.env.GEMINI_API_KEY,
      });
      res.json(result);
    } catch (err: any) {
      console.error('Error in /api/ielts-ai/evaluate-speaking:', err);
      res.status(500).json({ error: 'EVALUATION_FAILED', message: err.message });
    }
  });

  // 3. [MODE: DIAGNOSTIC_LEARNING_PLANNER]
  app.post('/api/ielts-ai/diagnostic-planner', async (req, res) => {
    try {
      const { targetOverallBand, currentScores, errorBreakdown, weeksCount, model } = req.body;
      const result = await generateDiagnosticLearningPlan({
        targetOverallBand: targetOverallBand || 7.5,
        currentScores: currentScores || { listening: 6.5, reading: 6.5, writing: 6.0, speaking: 6.5, overall: 6.5 },
        errorBreakdown,
        weeksCount: weeksCount || 6,
        model: model || 'gemini-2.5-flash',
        apiKey: process.env.GEMINI_API_KEY,
      });
      res.json(result);
    } catch (err: any) {
      console.error('Error in /api/ielts-ai/diagnostic-planner:', err);
      res.status(500).json({ error: 'PLANNING_FAILED', message: err.message });
    }
  });

  // 4. [ARIA: PERSONAL 1-ON-1 IELTS AI TUTOR]
  app.post('/api/aria/chat', async (req, res) => {
    try {
      const { message, history, context, model } = req.body;
      const reply = await askAriaTutor({
        message: message || '',
        history: history || [],
        context: context || {
          userName: 'Student',
          currentBand: 6.5,
          targetBand: 7.5,
          weakAreas: ['Matching Headings in Reading', 'Writing Task 1 Overview', 'Part 3 Fluency'],
          currentModule: 'Academic Writing & CD-IELTS Prep',
        },
        model: model || 'gemini-2.5-flash',
        apiKey: process.env.GEMINI_API_KEY,
      });
      res.json({ reply });
    } catch (err: any) {
      console.error('Error in /api/aria/chat:', err);
      res.status(500).json({ error: 'ARIA_CHAT_FAILED', message: err.message });
    }
  });

  // Engine status check
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      engine: 'IELTS Core AI Engine',
      modes: ['WRITING_EVALUATOR', 'SPEAKING_EVALUATOR', 'DIAGNOSTIC_LEARNING_PLANNER'],
      models: ['gemini-2.5-flash', 'gemini-2.5-pro'],
      apiKeyConfigured: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // Mount Vite dev server or static files in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[IELTS Core AI Engine] Autonomous LMS Server listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to initialize IELTS Core AI Engine server:', err);
});
