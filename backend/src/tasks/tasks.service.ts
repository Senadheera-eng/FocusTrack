import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async create(taskData: Partial<Task>, user: User): Promise<Task> {
    const task = this.tasksRepository.create({ ...taskData, user });
    return this.tasksRepository.save(task);
  }

  async findAll(user: User): Promise<Task[]> {
    return this.tasksRepository.find({ where: { user: { id: user.id } } });
  }

  async findOne(id: string, user: User): Promise<Task> {
    const task = await this.tasksRepository.findOne({ where: { id, user: { id: user.id } } });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(id: string, updateData: Partial<Task>, user: User): Promise<Task> {
    const task = await this.findOne(id, user);
    Object.assign(task, updateData);
    if (updateData.status === 'done' && !task.completedAt) {
      task.completedAt = new Date();
    }
    return this.tasksRepository.save(task);
  }

  async remove(id: string, user: User): Promise<void> {
    const task = await this.findOne(id, user);
    await this.tasksRepository.remove(task);
  }
}