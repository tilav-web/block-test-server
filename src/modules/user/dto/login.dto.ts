import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: "Email manzil noto\'g\'ri formatda" })
  @IsNotEmpty({ message: 'Email manzil kiritilishi shart' })
  email: string;

  @IsString({ message: "Parol matn ko\'rinishida bo\'lishi kerak" })
  @IsNotEmpty({ message: "Parol kiritilishi shart" })
  @MinLength(6, { message: "Parol kamida 6 ta belgidan iborat bo\'lishi kerak" })
  password: string;
} 