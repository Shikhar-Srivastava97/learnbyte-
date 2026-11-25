import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { apiRouter } from './routes/api.js';
import { storage } from './services/storageService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());

app.use('/api', apiRouter);

const clientDistPath = path.resolve(__dirname, '../../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

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
