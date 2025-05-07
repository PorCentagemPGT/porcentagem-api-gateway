import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { BelvoController } from './belvo.controller';
import { BelvoService } from './belvo.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    ConfigModule,
  ],
  controllers: [BelvoController],
  providers: [BelvoService],
  exports: [BelvoService],
})
export class BelvoModule {}
