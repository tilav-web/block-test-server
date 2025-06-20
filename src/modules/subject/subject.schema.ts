import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Subject extends Document {
  @Prop({ required: true })
  name: string;
}

export const SubjectSchema = SchemaFactory.createForClass(Subject);
