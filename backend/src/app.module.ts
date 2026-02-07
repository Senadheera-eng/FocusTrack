import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // 1. Load .env globally
    ConfigModule.forRoot({
      isGlobal: true,              // makes ConfigService available everywhere
      envFilePath: '.env',         // path relative to backend folder
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
        autoLoadEntities: true,       // auto finds all your entities later
        synchronize: configService.get<boolean>('DATABASE_SYNCHRONIZE', false), // true only in dev!
        logging: ['query', 'error'],  // shows SQL queries in terminal (helpful)
      }),
      inject: [ConfigService],        // ← this injects ConfigService into useFactory
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}