import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthService } from '../user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromCookie(request);

    if (!token) {
      throw new UnauthorizedException(
        'Token topilmadi. Iltimos, tizimga kiring.',
      );
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);

      // Validate user exists and is active
      const user = await this.authService.validateUser(payload.sub);

      // Attach user to request for use in controllers
      request['user'] = user;

      return true;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException(
        'Token yaroqsiz yoki muddati tugagan. Iltimos, qaytadan tizimga kiring.',
      );
    }
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    // First try to get token from cookie
    const cookieToken = request.cookies?.token;
    if (cookieToken) {
      return cookieToken;
    }

    // If no cookie token, try Authorization header
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      return token;
    }

    return undefined;
  }
}
