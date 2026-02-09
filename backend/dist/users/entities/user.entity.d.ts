import { Task } from '../../tasks/entities/task.entity';
export declare class User {
    id: string;
    email: string;
    password: string;
    username?: string;
    profilePicture?: string;
    createdAt: Date;
    updatedAt: Date;
    tasks: Task[];
}
