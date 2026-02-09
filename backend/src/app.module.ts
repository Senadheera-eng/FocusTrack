import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { TimeEntriesModule } from './time-entries/time-entries.module';

@Module({
  imports: [
    // 1. Load .env globally
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // 2. Connect to PostgreSQL using values from .env
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres' as const,
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        autoLoadEntities: true,
        synchronize: configService.get<string>('DATABASE_SYNCHRONIZE', 'false') === 'true',
        logging: ['query', 'error'],
      }),
      inject: [ConfigService],
    }),

    UsersModule,
    AuthModule,
    TasksModule,
    TimeEntriesModule, // ← NEW: Time tracking module
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}