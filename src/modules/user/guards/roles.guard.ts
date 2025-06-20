import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../user.schema';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: UserRole[]) => {
  return (target: any, key?: string, descriptor?: any) => {
    Reflect.defineMetadata(ROLES_KEY, roles, descriptor.value);
    return descriptor;
  };
};

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    console.log('=== ROLES GUARD CALLED ===');
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    this.logger.log(
      `RolesGuard: Required roles: ${JSON.stringify(requiredRoles)}`,
    );

    if (!requiredRoles) {
      this.logger.log('RolesGuard: No roles required, allowing access');
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    this.logger.log(
      `RolesGuard: User from request: ${user ? JSON.stringify({ id: user._id, role: user.role }) : 'null'}`,
    );

    if (!user) {
      this.logger.error('RolesGuard: No user found in request');
      throw new ForbiddenException("Foydalanuvchi ma'lumotlari topilmadi");
    }

    const hasRole = requiredRoles.some((role) => user.role === role);
    this.logger.log(`RolesGuard: User has required role: ${hasRole}`);

    if (!hasRole) {
      this.logger.error(
        `RolesGuard: User role ${user.role} not in required roles ${JSON.stringify(requiredRoles)}`,
      );
      throw new ForbiddenException(
        "Bu sahifaga kirish uchun yetarli huquqlaringiz yo'q",
      );
    }

    this.logger.log('RolesGuard: Access granted');
    return true;
  }
}
