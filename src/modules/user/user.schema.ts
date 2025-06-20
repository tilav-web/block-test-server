import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  STUDENT = 'student',
  ADMIN = 'admin',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  full_name: string;

  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  email: string;

  @Prop({ required: true, trim: true })
  phone: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    type: String,
    enum: UserRole,
    default: UserRole.STUDENT,
  })
  role: UserRole;

  @Prop({ default: true })
  is_active: boolean;

  @Prop({ default: false })
  is_verified: boolean;

  @Prop({ type: [Types.ObjectId], ref: 'Block', default: [] })
  accessible_blocks: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
