import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { User } from '../users/entities/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  /**
   * Create a new task for the authenticated user
   */
  async create(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const task = this.tasksRepository.create({ 
      ...createTaskDto, 
      user,
      status: createTaskDto.status || 'todo', // Default to 'todo' if not provided
    });
    return this.tasksRepository.save(task);
  }

  /**
   * Get all tasks for the authenticated user
   */
  async findAll(user: User): Promise<Task[]> {
    return this.tasksRepository.find({ 
      where: { user: { id: user.id } },
      order: { createdAt: 'DESC' }, // Most recent first
    });
  }

  /**
   * Get a single task by ID (only if it belongs to the user)
   */
  async findOne(id: string, user: User): Promise<Task> {
    const task = await this.tasksRepository.findOne({ 
      where: { id, user: { id: user.id } } 
    });
    
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    
    return task;
  }

  /**
   * Update a task (only if it belongs to the user)
   */
  async update(id: string, updateTaskDto: UpdateTaskDto, user: User): Promise<Task> {
    const task = await this.findOne(id, user);
    
    // Update fields
    Object.assign(task, updateTaskDto);
    
    // If marking as done, set completedAt timestamp
    if (updateTaskDto.status === 'done' && !task.completedAt) {
      task.completedAt = new Date();
    }
    
    // If un-marking as done, clear completedAt
    if (updateTaskDto.status !== 'done' && task.completedAt) {
      task.completedAt = undefined;
    }
    
    return this.tasksRepository.save(task);
  }

  /**
   * Delete a task (only if it belongs to the user)
   */
  async remove(id: string, user: User): Promise<void> {
    const task = await this.findOne(id, user);
    await this.tasksRepository.remove(task);
  }
}