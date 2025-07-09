import express from 'express';
import cors from 'cors';
import tasks from './routes/tasks.js';

import path from "path";

const PORT = process.env.PORT || 5050;
const app = express();

const __dirname = path.resolve();

app.use(cors());
app.use(express.json());
app.use('/tasks', tasks);

if (process.env.NODE_ENV === 'production') {
  // Serve static files from the React app
  app.use(express.static(path.join(__dirname, 'client', 'build')));

  // Handle any requests that don't match the above routes with the React app
  app.get('/{*any}*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
}

// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});