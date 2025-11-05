import express from "express";
import cors from "cors";
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'https://mileapptasks.netlify.app'],
  credentials: true
}))
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!') 
});

app.use('/login', authRoutes);
app.use('/tasks', taskRoutes);

export default app;