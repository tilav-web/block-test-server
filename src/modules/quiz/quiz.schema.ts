// src/modules/quiz/schemas/quiz.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type QuizDocument = Quiz & Document;

@Schema({ timestamps: true })
export class Quiz {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Block', required: true })
  block: Types.ObjectId;

  @Prop({
    type: {
      subject: { type: Types.ObjectId, ref: 'Subject' },
      correctAnswers: Number,
      score: Number,
    },
  })
  main: {
    subject: Types.ObjectId;
    correctAnswers: number;
    score: number;
  };

  @Prop({
    type: {
      subject: { type: Types.ObjectId, ref: 'Subject' },
      correctAnswers: Number,
      score: Number,
    },
  })
  addition: {
    subject: Types.ObjectId;
    correctAnswers: number;
    score: number;
  };

  @Prop([
    {
      subject: { type: Types.ObjectId, ref: 'Subject' },
      correctAnswers: Number,
      score: Number,
    },
  ])
  mandatory: {
    subject: Types.ObjectId;
    correctAnswers: number;
    score: number;
  }[];

  @Prop()
  totalScore: number;
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
