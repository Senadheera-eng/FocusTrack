import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  Req,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Request } from 'express';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  /**
   * Create a new task
   * POST /tasks
   * Body: { title: string, description?: string, status?: 'todo' | 'in_progress' | 'done' }
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body(ValidationPipe) createTaskDto: CreateTaskDto, 
    @Req() req: Request & { user: any }
  ) {
    return this.tasksService.create(createTaskDto, req.user);
  }

  /**
   * Get all tasks for the authenticated user
   * GET /tasks
   */
  @Get()
  findAll(@Req() req: Request & { user: any }) {
    return this.tasksService.findAll(req.user);
  }

  /**
   * Get a single task by ID
   * GET /tasks/:id
   */
  @Get(':id')
  findOne(
    @Param('id') id: string, 
    @Req() req: Request & { user: any }
  ) {
    return this.tasksService.findOne(id, req.user);
  }

  /**
   * Update a task
   * PATCH /tasks/:id
   * Body: { title?: string, description?: string, status?: 'todo' | 'in_progress' | 'done' }
   */
  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Body(ValidationPipe) updateTaskDto: UpdateTaskDto, 
    @Req() req: Request & { user: any }
  ) {
    return this.tasksService.update(id, updateTaskDto, req.user);
  }

  /**
   * Delete a task
   * DELETE /tasks/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id') id: string, 
    @Req() req: Request & { user: any }
  ) {
    return this.tasksService.remove(id, req.user);
  }
}