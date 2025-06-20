import { IsEmail, IsNotEmpty, IsString, MinLength, Matches, IsOptional } from 'class-validator';
import { UserRole } from '../user.schema';

export class RegisterDto {
  @IsString({ message: 'To\'liq ism familiya matn ko\'rinishida bo\'lishi kerak' })
  @IsNotEmpty({ message: 'To\'liq ism familiya kiritilishi shart' })
  full_name: string;

  @IsEmail({}, { message: 'Email manzil noto\'g\'ri formatda' })
  @IsNotEmpty({ message: 'Email manzil kiritilishi shart' })
  email: string;

  @IsString({ message: 'Telefon raqam matn ko\'rinishida bo\'lishi kerak' })
  @IsNotEmpty({ message: 'Telefon raqam kiritilishi shart' })
  @Matches(/^\+998[0-9]{9}$/, { message: 'Telefon raqam +998 bilan boshlanib, 12 ta raqamdan iborat bo\'lishi kerak' })
  phone: string;

  @IsString({ message: 'Parol matn ko\'rinishida bo\'lishi kerak' })
  @IsNotEmpty({ message: 'Parol kiritilishi shart' })
  @MinLength(6, { message: 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak' })
  password1: string;

  @IsString({ message: 'Parolni tasdiqlash matn ko\'rinishida bo\'lishi kerak' })
  @IsNotEmpty({ message: 'Parolni tasdiqlash kiritilishi shart' })
  password2: string;

  @IsOptional()
  role?: UserRole;
} 