import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { TimeEntry } from './entities/time-entry.entity';
import { Task } from '../tasks/entities/task.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TimeEntriesService {
  constructor(
    @InjectRepository(TimeEntry)
    private timeEntriesRepository: Repository<TimeEntry>,
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  /**
   * Start a new timer for a task
   */
  async startTimer(taskId: string, user: User): Promise<TimeEntry> {
    // Verify task exists and belongs to user
    const task = await this.tasksRepository.findOne({
      where: { id: taskId, user: { id: user.id } },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    // Check if there's already an active timer for this task
    const activeTimer = await this.timeEntriesRepository.findOne({
      where: { 
        taskId: taskId,
        userId: user.id,
        endTime: IsNull() 
      },
    });

    if (activeTimer) {
      throw new BadRequestException('Timer is already running for this task');
    }

    // Create new time entry using IDs
    const timeEntry = this.timeEntriesRepository.create({
      taskId: taskId,
      userId: user.id,
      startTime: new Date(),
      endTime: null,
      duration: 0,
    });

    return this.timeEntriesRepository.save(timeEntry);
  }

  /**
   * Stop the active timer for a task
   */
  async stopTimer(taskId: string, user: User): Promise<TimeEntry> {
    // Find active timer using IDs
    const activeTimer = await this.timeEntriesRepository.findOne({
      where: { 
        taskId: taskId,
        userId: user.id,
        endTime: IsNull() 
      },
    });

    if (!activeTimer) {
      throw new NotFoundException('No active timer found for this task');
    }

    // Calculate duration in seconds
    const endTime = new Date();
    const durationMs = endTime.getTime() - activeTimer.startTime.getTime();
    const durationSeconds = Math.floor(durationMs / 1000);

    // Update time entry
    activeTimer.endTime = endTime;
    activeTimer.duration = durationSeconds;

    return this.timeEntriesRepository.save(activeTimer);
  }

  /**
   * Get all time entries for a task
   */
  async getTaskTimeEntries(taskId: string, user: User): Promise<TimeEntry[]> {
    // Verify task belongs to user
    const task = await this.tasksRepository.findOne({
      where: { id: taskId, user: { id: user.id } },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    return this.timeEntriesRepository.find({
      where: { taskId: taskId, userId: user.id },
      order: { startTime: 'DESC' },
    });
  }

  /**
   * Get active timer for a task (if any)
   */
  async getActiveTimer(taskId: string, user: User): Promise<TimeEntry | null> {
    return this.timeEntriesRepository.findOne({
      where: { 
        taskId: taskId,
        userId: user.id,
        endTime: IsNull() 
      },
    });
  }

  /**
   * Get total time spent on a task (in seconds)
   */
  async getTotalTimeForTask(taskId: string, user: User): Promise<number> {
    const entries = await this.getTaskTimeEntries(taskId, user);
    return entries.reduce((total, entry) => total + entry.duration, 0);
  }

  /**
   * Get all active timers for a user
   */
  async getUserActiveTimers(user: User): Promise<TimeEntry[]> {
    return this.timeEntriesRepository.find({
      where: { 
        userId: user.id,
        endTime: IsNull() 
      },
      order: { startTime: 'DESC' },
    });
  }
}