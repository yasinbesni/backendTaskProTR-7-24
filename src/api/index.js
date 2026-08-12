import express from 'express';
import serverless from 'serverless-http'; // npm install serverless-http
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Örnek route
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Vercel!' });
});

// Diğer route’ları buraya ekleyebilirsin

export const handler = serverless(app);
// Routes
app.use('/api/auth', authRouter);
app.use('/api/boards', boardRoutes);
app.use('/api/columns', columnRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/help', helpRouter);
