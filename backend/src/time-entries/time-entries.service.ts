import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, MoreThanOrEqual } from 'typeorm';
import { TimeEntry } from './entities/time-entry.entity';
import { Task } from '../tasks/entities/task.entity';
import { User } from '../users/entities/user.entity';

export interface ProductivityStats {
  completedToday: number;
  completedThisWeek: number;
  hoursTrackedToday: number;
  hoursTrackedThisWeek: number;
  totalTasks: number;
  totalCompleted: number;
  totalInProgress: number;
  totalTodo: number;
  streakDays: number;
}

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

  /**
   * Get productivity stats for the authenticated user
   */
  async getProductivityStats(user: User): Promise<ProductivityStats> {
    const now = new Date();

    // Start of today (midnight local)
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Start of this week (Monday)
    const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon, ...
    const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - diffToMonday);

    // --- Task stats ---
    const allTasks = await this.tasksRepository.find({
      where: { user: { id: user.id } },
    });

    const totalTasks = allTasks.length;
    const totalCompleted = allTasks.filter(t => t.status === 'done').length;
    const totalInProgress = allTasks.filter(t => t.status === 'in_progress').length;
    const totalTodo = allTasks.filter(t => t.status === 'todo').length;

    const completedToday = allTasks.filter(
      t => t.completedAt && new Date(t.completedAt) >= startOfToday,
    ).length;

    const completedThisWeek = allTasks.filter(
      t => t.completedAt && new Date(t.completedAt) >= startOfWeek,
    ).length;

    // --- Time tracking stats ---
    const todayEntries = await this.timeEntriesRepository.find({
      where: {
        userId: user.id,
        startTime: MoreThanOrEqual(startOfToday),
      },
    });

    const weekEntries = await this.timeEntriesRepository.find({
      where: {
        userId: user.id,
        startTime: MoreThanOrEqual(startOfWeek),
      },
    });

    const hoursTrackedToday = todayEntries.reduce((sum, e) => sum + e.duration, 0) / 3600;
    const hoursTrackedThisWeek = weekEntries.reduce((sum, e) => sum + e.duration, 0) / 3600;

    // --- Streak: consecutive days with at least one completed task ---
    let streakDays = 0;
    const checkDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const completedDates = new Set(
      allTasks
        .filter(t => t.completedAt)
        .map(t => {
          const d = new Date(t.completedAt!);
          return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
        }),
    );

    for (let i = 0; i < 365; i++) {
      const key = `${checkDate.getFullYear()}-${checkDate.getMonth()}-${checkDate.getDate()}`;
      if (completedDates.has(key)) {
        streakDays++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (i === 0) {
        // Today might not have completions yet, check yesterday
        checkDate.setDate(checkDate.getDate() - 1);
        continue;
      } else {
        break;
      }
    }

    return {
      completedToday,
      completedThisWeek,
      hoursTrackedToday: Math.round(hoursTrackedToday * 100) / 100,
      hoursTrackedThisWeek: Math.round(hoursTrackedThisWeek * 100) / 100,
      totalTasks,
      totalCompleted,
      totalInProgress,
      totalTodo,
      streakDays,
    };
  }
}