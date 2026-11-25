import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { apiRouter } from './routes/api.js';
import { storage } from './services/storageService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());

app.use('/api', apiRouter);

async function startServer() {
  await storage.init(MONGODB_URI);

  app.listen(PORT, () => {
    console.log(`
╔═════════════════════════════════════════════════════════════════╗
║                   ⚡ LEARNBYTE AI BACKEND                       ║
║        NVIDIA Nemotron YouTube-to-Course Learning Engine        ║
╠═════════════════════════════════════════════════════════════════╣
║  • Server:   http://localhost:${PORT}                             ║
║  • API:      http://localhost:${PORT}/api/health                  ║
║  • Mode:     ${process.env.NODE_ENV || 'development'}                                    ║
║  • Engine:   NVIDIA Nemotron 4-340B & Llama 3.1 70B Ready       ║
╚═════════════════════════════════════════════════════════════════╝
    `);
  });
}

startServer().catch(err => {
  console.error('Failed to start LearnByte server:', err);
});
