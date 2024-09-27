const express = require('express');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const path = require('path');
const { fetchAllData } = require('./zoomapi');
const { handleBotEvent } = require('./zoom_chatbot');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;

app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  res.send('OK');
});

app.post('/anthropic', (req, res) => {
  console.log('Received POST request to /anthropic');
  console.log('Request body:', JSON.stringify(req.body, null, 2));
  handleBotEvent(req, res);
});

app.listen(port, () => console.log(`Listening at http://localhost:${port}`));

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

