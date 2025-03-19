import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { AuthApiService } from './services/auth-api.service';
import { CoreApiService } from './services/core-api.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    ConfigModule,
  ],
  providers: [AuthApiService, CoreApiService],
  exports: [AuthApiService, CoreApiService],
})
export class ProxyModule {}
