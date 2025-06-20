import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument, UserRole } from './user.schema';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/user-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { full_name, email, phone, password1, password2, role } = registerDto;

    // Check if passwords match
    if (password1 !== password2) {
      throw new BadRequestException('Parollar mos kelmaydi');
    }

    // Check if user already exists
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException(
        "Bu email manzil allaqachon ro'yxatdan o'tgan",
      );
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password1, saltRounds);

    // Create new user
    const newUser = new this.userModel({
      full_name,
      email,
      phone,
      password: hashedPassword,
      role: role || UserRole.STUDENT,
    });

    const savedUser = await newUser.save();

    // Generate JWT token
    const payload = {
      sub: savedUser._id,
      email: savedUser.email,
      role: savedUser.role,
    };

    const token = this.jwtService.sign(payload);

    // Return user data without password
    const userResponse = {
      id: savedUser._id.toString(),
      full_name: savedUser.full_name,
      email: savedUser.email,
      phone: savedUser.phone,
      role: savedUser.role,
      is_active: savedUser.is_active,
      is_verified: savedUser.is_verified,
      accessible_blocks: savedUser.accessible_blocks.map((id) => id.toString()),
      created_at: savedUser['createdAt'],
      updated_at: savedUser['updatedAt'],
    };

    return {
      user: userResponse,
      token,
      message: "Ro'yxatdan o'tish muvaffaqiyatli amalga oshirildi",
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    // Find user by email
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException("Email yoki parol noto'g'ri");
    }

    // Check if user is active
    if (!user.is_active) {
      throw new UnauthorizedException('Hisobingiz bloklangan');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Email yoki parol noto'g'ri");
    }

    // Generate JWT token
    const payload = {
      sub: user._id,
      email: user.email,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);

    // Return user data without password
    const userResponse = {
      id: user._id.toString(),
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      is_active: user.is_active,
      is_verified: user.is_verified,
      accessible_blocks: user.accessible_blocks.map((id) => id.toString()),
      created_at: user['createdAt'],
      updated_at: user['updatedAt'],
    };

    return {
      user: userResponse,
      token,
      message: 'Tizimga kirish muvaffaqiyatli amalga oshirildi',
    };
  }

  async validateUser(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user || !user.is_active) {
      throw new UnauthorizedException(
        'Foydalanuvchi topilmadi yoki hisob bloklangan',
      );
    }
    return user;
  }

  // Block access management methods
  async getAllUsers(): Promise<User[]> {
    return this.userModel.find().select('-password').exec();
  }

  async getUserById(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId).select('-password');
    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }
    return user;
  }

  async grantBlockAccess(userId: string, blockId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    const blockObjectId = new Types.ObjectId(blockId);

    // Check if user already has access to this block
    if (user.accessible_blocks.includes(blockObjectId)) {
      throw new BadRequestException(
        'Foydalanuvchi allaqachon bu blokka ruxsatga ega',
      );
    }

    // Add block access
    user.accessible_blocks.push(blockObjectId);
    await user.save();

    return this.userModel.findById(userId).select('-password');
  }

  async revokeBlockAccess(userId: string, blockId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    const blockObjectId = new Types.ObjectId(blockId);

    // Remove block access
    user.accessible_blocks = user.accessible_blocks.filter(
      (id) => !id.equals(blockObjectId),
    );
    await user.save();

    return this.userModel.findById(userId).select('-password');
  }

  async getUserBlockAccess(userId: string): Promise<string[]> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }
    return user.accessible_blocks.map((id) => id.toString());
  }

  async checkBlockAccess(userId: string, blockId: string): Promise<boolean> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      return false;
    }

    const blockObjectId = new Types.ObjectId(blockId);
    return user.accessible_blocks.some((id) => id.equals(blockObjectId));
  }
}
