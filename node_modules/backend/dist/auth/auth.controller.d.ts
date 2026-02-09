import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UsersService } from '../users/users.service';
import { Request } from 'express';
export declare class AuthController {
    private authService;
    private usersService;
    constructor(authService: AuthService, usersService: UsersService);
    register(dto: RegisterDto): Promise<{
        access_token: string;
    }>;
    login(dto: LoginDto): Promise<{
        access_token: string;
    }>;
    getProfile(req: Request & {
        user: {
            userId: string;
            email: string;
        };
    }): Promise<{
        userId: string;
        email: string;
        username: string | null;
        profilePicture: string | null;
    }>;
    updateProfile(req: Request & {
        user: {
            userId: string;
            email: string;
        };
    }, dto: UpdateProfileDto): Promise<{
        userId: string;
        email: string;
        username: string | null;
        profilePicture: string | null;
    }>;
}
