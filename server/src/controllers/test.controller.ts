// src/controllers/test.controller.ts
import { Request, Response, NextFunction } from 'express';
import { Test } from '../models/test.model';
import { AppError } from '../middleware/error.middleware';

export const createTest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const test = await Test.create({
      ...req.body,
      createdBy: req.user.id,
    });

    res.status(201).json({
      status: 'success',
      data: { test },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllTests = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tests = await Test.find({ createdBy: req.user.id });

    res.status(200).json({
      status: 'success',
      results: tests.length,
      data: { tests },
    });
  } catch (error) {
    next(error);
  }
};

export const getTestById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const test = await Test.findById(req.params.id);

    if (!test) {
      return next(new AppError('Test not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { test },
    });
  } catch (error) {
    next(error);
  }
};