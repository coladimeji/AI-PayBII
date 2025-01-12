// src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middleware/error.middleware';
import { environment } from './config/environment';

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes (will be added later)
// app.use('/api/auth', authRoutes);
// app.use('/api/tests', testRoutes);

// Error handling
app.use(errorHandler);

export default app;