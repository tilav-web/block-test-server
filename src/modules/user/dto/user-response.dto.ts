import { UserRole } from '../user.schema';

export class AuthResponseDto {
  user: {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    role: UserRole;
    is_active: boolean;
    is_verified: boolean;
    accessible_blocks?: string[];
    created_at: Date;
    updated_at: Date;
  };
  token: string;
  message: string;
}