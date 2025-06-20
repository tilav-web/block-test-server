import {
  Controller,
  Post,
  Body,
  Res,
  ValidationPipe,
  UsePipes,
  Get,
  UseGuards,
  Param,
  Patch,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/user-response.dto';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard, Roles } from './guards/roles.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User, UserRole } from './user.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ transform: true }))
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const result = await this.authService.register(registerDto);

    // Set JWT token in HTTP-only cookie
    res.cookie('token', result.token, {
      httpOnly: true,
      secure: false, // Set to false for development
      sameSite: 'lax', // Changed from 'strict' to 'lax'
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/', // Ensure cookie is available for all paths
    });

    // Return user data and message (token is in cookie)
    return {
      user: result.user,
      token: result.token, // Also return token in response for client-side access
      message: result.message,
    };
  }

  @Post('login')
  @UsePipes(new ValidationPipe({ transform: true }))
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const result = await this.authService.login(loginDto);

    // Set JWT token in HTTP-only cookie
    res.cookie('token', result.token, {
      httpOnly: true,
      secure: false, // Set to false for development
      sameSite: 'lax', // Changed from 'strict' to 'lax'
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Return user data and message (token is in cookie)
    return {
      user: result.user,
      token: result.token, // Also return token in response for client-side access
      message: result.message,
    };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    // Clear the JWT token cookie
    res.clearCookie('token');

    return {
      message: 'Tizimdan chiqish muvaffaqiyatli amalga oshirildi',
    };
  }

  // Protected routes that require authentication
  @Get('profile')
  @UseGuards(AuthGuard)
  async getProfile(@CurrentUser() user: User) {
    return {
      message: "Foydalanuvchi ma'lumotlari",
      user: {
        id: user['_id'],
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        is_active: user.is_active,
        is_verified: user.is_verified,
        accessible_blocks: user.accessible_blocks.map((id) => id.toString()),
        created_at: user['createdAt'],
        updated_at: user['updatedAt'],
      },
    };
  }

  @Get('dashboard')
  @UseGuards(AuthGuard)
  async getDashboard(@CurrentUser() user: User) {
    return {
      message: "Dashboard ma'lumotlari",
      user: {
        id: user['_id'],
        full_name: user.full_name,
        role: user.role,
      },
      dashboard: {
        welcome: `Xush kelibsiz, ${user.full_name}!`,
        role: user.role === 'admin' ? 'Administrator' : 'Student',
        lastLogin: new Date().toISOString(),
      },
    };
  }

  // Admin-only route
  @Get('admin-panel')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getAdminPanel(@CurrentUser() user: User) {
    return {
      message: "Admin panel ma'lumotlari",
      user: {
        id: user['_id'],
        full_name: user.full_name,
        role: user.role,
      },
      adminPanel: {
        title: 'Administrator paneli',
        description: 'Bu sahifaga faqat admin foydalanuvchilar kira oladi',
        features: [
          'Foydalanuvchilarni boshqarish',
          'Tizim sozlamalari',
          'Hisobotlar',
        ],
        lastAccess: new Date().toISOString(),
      },
    };
  }

  // Admin-only routes for user management
  @Get('users')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getAllUsers() {
    const users = await this.authService.getAllUsers();
    return users;
  }

  @Get('users/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getUserById(@Param('id') id: string) {
    const user = await this.authService.getUserById(id);
    return {
      message: "Foydalanuvchi ma'lumotlari",
      user,
    };
  }

  @Get('users/:id/block-access')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getUserBlockAccess(@Param('id') id: string) {
    const blockAccess = await this.authService.getUserBlockAccess(id);
    return blockAccess;
  }

  @Patch('users/:id/grant-block/:blockId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async grantBlockAccess(
    @Param('id') userId: string,
    @Param('blockId') blockId: string,
  ) {
    const user = await this.authService.grantBlockAccess(userId, blockId);
    return {
      message: 'Blok ruxsati muvaffaqiyatli berildi',
      user,
    };
  }

  @Patch('users/:id/revoke-block/:blockId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async revokeBlockAccess(
    @Param('id') userId: string,
    @Param('blockId') blockId: string,
  ) {
    const user = await this.authService.revokeBlockAccess(userId, blockId);
    return {
      message: 'Blok ruxsati muvaffaqiyatli olib tashlandi',
      user,
    };
  }

  // Student route to check block access
  @Get('check-block-access/:blockId')
  @UseGuards(AuthGuard)
  async checkBlockAccess(
    @CurrentUser() user: User,
    @Param('blockId') blockId: string,
  ) {
    const hasAccess = await this.authService.checkBlockAccess(
      user['_id'],
      blockId,
    );
    return {
      message: 'Blok ruxsati tekshirildi',
      hasAccess,
      blockId,
    };
  }
}
