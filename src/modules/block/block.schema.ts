import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BlockDocument = Block & Document;

@Schema({ timestamps: true })
export class Block {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ ref: 'Subject' })
  main: Types.ObjectId;

  @Prop({ ref: 'Subject' })
  addition: Types.ObjectId;

  @Prop({ ref: 'Subject' })
  mandatory: Types.ObjectId[];
}

export const BlockSchema = SchemaFactory.createForClass(Block);