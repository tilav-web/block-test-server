import { Types } from 'mongoose';

export class UpdateQuizDto {
  user?: Types.ObjectId;
  block?: Types.ObjectId;
  main?: {
    subject: Types.ObjectId;
    correctAnswers: number;
    score: number;
  };
  addition?: {
    subject: Types.ObjectId;
    correctAnswers: number;
    score: number;
  };
  mandatory?: {
    subject: Types.ObjectId;
    correctAnswers: number;
    score: number;
  }[];
  totalScore?: number;
} 