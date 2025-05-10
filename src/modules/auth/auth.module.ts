import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ProxyModule } from '../../proxy/proxy.module';
import { UsersModule } from '../core/users/users.module';

@Module({
  imports: [ProxyModule, UsersModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
