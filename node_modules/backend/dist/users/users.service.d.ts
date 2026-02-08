import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    findByEmail(email: string): Promise<User | null>;
    create(email: string, hashedPassword: string): Promise<User>;
    findById(id: string): Promise<User | null>;
    updateProfile(id: string, data: {
        username?: string;
        profilePicture?: string;
    }): Promise<User>;
}
