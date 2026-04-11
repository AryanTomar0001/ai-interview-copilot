const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const attemptRoutes = require('./routes/attemptRoutes');
const limitRoutes = require('./routes/limitRoutes');
const resumeRoutes = require('./routes/resumeRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/attempt', attemptRoutes);
app.use('/api/limit', limitRoutes);
app.use('/api/resume', resumeRoutes);

app.use(errorHandler);

module.exports = app;
