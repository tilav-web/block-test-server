# Authentication Guards

Bu modul foydalanuvchilar autentifikatsiyasi va avtorizatsiyasi uchun guard'lar taqdim etadi.

## Guard'lar

### 1. AuthGuard
Cookie'dan JWT token'ni o'qib, foydalanuvchini autentifikatsiya qiladi.

**Foydalanish:**
```typescript
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from './guards/auth.guard';

@Get('protected-route')
@UseGuards(AuthGuard)
async protectedRoute() {
  // Bu route faqat autentifikatsiya qilingan foydalanuvchilar uchun
}
```

### 2. RolesGuard
Foydalanuvchining roli asosida sahifaga kirish huquqini tekshiradi.

**Foydalanish:**
```typescript
import { UseGuards } from '@nestjs/common';
import { AuthGuard, RolesGuard, Roles } from './guards';
import { UserRole } from './user.schema';

@Get('admin-only')
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
async adminOnlyRoute() {
  // Bu route faqat admin foydalanuvchilar uchun
}
```

## Decorator'lar

### CurrentUser
Joriy autentifikatsiya qilingan foydalanuvchini olish uchun.

**Foydalanish:**
```typescript
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.schema';

@Get('profile')
@UseGuards(AuthGuard)
async getProfile(@CurrentUser() user: User) {
  return { user };
}
```

## API Endpoint'lar

### Public Routes (Guard yo'q)
- `POST /auth/register` - Ro'yxatdan o'tish
- `POST /auth/login` - Tizimga kirish
- `POST /auth/logout` - Tizimdan chiqish

### Protected Routes (AuthGuard bilan)
- `GET /auth/profile` - Foydalanuvchi ma'lumotlari
- `GET /auth/dashboard` - Dashboard ma'lumotlari

### Admin-only Routes (AuthGuard + RolesGuard bilan)
- `GET /auth/admin-panel` - Admin paneli

## Xatoliklar

- **401 Unauthorized**: Token topilmadi yoki yaroqsiz
- **403 Forbidden**: Foydalanuvchida kerakli huquqlar yo'q

## Cookie Sozlamalari

Token cookie'da saqlanadi:
- `httpOnly: true` - JavaScript orqali o'qib bo'lmaydi
- `secure: true` - HTTPS orqali yuboriladi (production'da)
- `sameSite: 'strict'` - CSRF hujumlaridan himoya
- `maxAge: 7 days` - 7 kun muddat 