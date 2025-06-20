import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum OptionType {
  TEXT = 'text',
  FILE = 'file',
  URL = 'url',
}

@Schema()
export class Option extends Document {
  @Prop({ required: true, enum: OptionType })
  type: OptionType;

  @Prop({ required: true })
  value: string;
}

export const OptionSchema = SchemaFactory.createForClass(Option);
