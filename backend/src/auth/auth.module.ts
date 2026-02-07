import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    JwtModule.registerAsync({
  useFactory: (config: ConfigService) => {
    const expiresIn = config.get<string>('JWT_EXPIRES_IN') || '1d'; 
          
          const expiresInAsAny = expiresIn as any;

    return {
      secret: config.get<string>('JWT_SECRET')!, 
            signOptions: { expiresIn: expiresInAsAny },              
    };
  },
  inject: [ConfigService],
}),
  ],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy,JwtAuthGuard],
  exports: [JwtAuthGuard],
})
export class AuthModule {}