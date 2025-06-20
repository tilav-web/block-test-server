import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Subject } from '../subject/subject.schema';

export enum TestType {
  TEXT = 'text',
  FILE = 'file',
  URL = 'url',
}

export enum TestDegree {
  EASY = 'easy',
  HARD = 'hard',
}

@Schema({ timestamps: true })
export class Test extends Document {
  @Prop({ required: true, ref: Subject.name })
  subject: Types.ObjectId;

  @Prop({ required: true })
  question: string;

  @Prop({ default: TestDegree.HARD, required: true })
  degree: TestDegree;

  @Prop({ required: false })
  target?: string;

  @Prop({ required: true, enum: TestType, default: TestType.TEXT })
  type: TestType;

  @Prop({ type: [Types.ObjectId], ref: 'Option', required: false })
  options: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'Option', required: false })
  correctOptionId: Types.ObjectId;
}

export const TestSchema = SchemaFactory.createForClass(Test);
