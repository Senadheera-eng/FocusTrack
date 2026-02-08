import { 
  Controller, 
  Post, 
  Get, 
  Param, 
  UseGuards, 
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TimeEntriesService } from './time-entries.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('time-entries')
@UseGuards(JwtAuthGuard)
export class TimeEntriesController {
  constructor(private readonly timeEntriesService: TimeEntriesService) {}

  /**
   * Start timer for a task
   * POST /time-entries/task/:taskId/start
   */
  @Post('task/:taskId/start')
  @HttpCode(HttpStatus.CREATED)
  startTimer(
    @Param('taskId') taskId: string,
    @Req() req: Request & { user: any }
  ) {
    return this.timeEntriesService.startTimer(taskId, req.user);
  }

  /**
   * Stop timer for a task
   * POST /time-entries/task/:taskId/stop
   */
  @Post('task/:taskId/stop')
  @HttpCode(HttpStatus.OK)
  stopTimer(
    @Param('taskId') taskId: string,
    @Req() req: Request & { user: any }
  ) {
    return this.timeEntriesService.stopTimer(taskId, req.user);
  }

  /**
   * Get all time entries for a task
   * GET /time-entries/task/:taskId
   */
  @Get('task/:taskId')
  getTaskTimeEntries(
    @Param('taskId') taskId: string,
    @Req() req: Request & { user: any }
  ) {
    return this.timeEntriesService.getTaskTimeEntries(taskId, req.user);
  }

  /**
   * Get active timer for a task
   * GET /time-entries/task/:taskId/active
   */
  @Get('task/:taskId/active')
  getActiveTimer(
    @Param('taskId') taskId: string,
    @Req() req: Request & { user: any }
  ) {
    return this.timeEntriesService.getActiveTimer(taskId, req.user);
  }

  /**
   * Get total time for a task
   * GET /time-entries/task/:taskId/total
   */
  @Get('task/:taskId/total')
  async getTotalTime(
    @Param('taskId') taskId: string,
    @Req() req: Request & { user: any }
  ) {
    const totalSeconds = await this.timeEntriesService.getTotalTimeForTask(taskId, req.user);
    return { 
      taskId, 
      totalSeconds,
      formatted: this.formatDuration(totalSeconds)
    };
  }

  /**
   * Get productivity stats for the user
   * GET /time-entries/productivity-stats
   */
  @Get('productivity-stats')
  getProductivityStats(@Req() req: Request & { user: any }) {
    return this.timeEntriesService.getProductivityStats(req.user);
  }

  /**
   * Get all active timers for the user
   * GET /time-entries/active
   */
  @Get('active')
  getUserActiveTimers(@Req() req: Request & { user: any }) {
    return this.timeEntriesService.getUserActiveTimers(req.user);
  }

  /**
   * Helper: Format duration in seconds to HH:MM:SS
   */
  private formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}