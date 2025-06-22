import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString({ message: "Joriy parol matn ko'rinishida bo'lishi kerak" })
  @IsNotEmpty({ message: 'Joriy parol kiritilishi shart' })
  @MinLength(6, {
    message: "Joriy parol kamida 6 ta belgidan iborat bo'lishi kerak",
  })
  oldPassword: string;

  @IsString({ message: "Yangi parol matn ko'rinishida bo'lishi kerak" })
  @IsNotEmpty({ message: 'Yangi parol kiritilishi shart' })
  @MinLength(6, {
    message: "Yangi parol kamida 6 ta belgidan iborat bo'lishi kerak",
  })
  newPassword: string;

  @IsString({
    message: "Yangi parolni tasdiqlash matn ko'rinishida bo'lishi kerak",
  })
  @IsNotEmpty({ message: 'Yangi parolni tasdiqlash kiritilishi shart' })
  confirmPassword: string;
}
