import express from "express";
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!') 
});

app.use('/login', authRoutes);
app.use('/tasks', taskRoutes);

export default app;