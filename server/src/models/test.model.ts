// src/models/test.model.ts
import mongoose, { Document } from 'mongoose';

export interface ITest extends Document {
  name: string;
  description: string;
  type: 'unit' | 'integration' | 'e2e';
  status: 'pending' | 'running' | 'completed' | 'failed';
  results: {
    passed: number;
    failed: number;
    total: number;
    duration: number;
  };
  createdBy: mongoose.Types.ObjectId;
}

const testSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Test name is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  type: {
    type: String,
    enum: ['unit', 'integration', 'e2e'],
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'running', 'completed', 'failed'],
    default: 'pending',
  },
  results: {
    passed: { type: Number, default: 0 },
    failed: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    duration: { type: Number, default: 0 },
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

export const Test = mongoose.model<ITest>('Test', testSchema);