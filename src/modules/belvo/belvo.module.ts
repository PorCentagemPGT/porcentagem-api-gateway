import { Module } from '@nestjs/common';
import { BelvoController } from './belvo.controller';
import { BelvoService } from './belvo.service';
import { ProxyModule } from '../../proxy/proxy.module';

@Module({
  imports: [ProxyModule],
  controllers: [BelvoController],
  providers: [BelvoService],
  exports: [BelvoService],
})
export class BelvoModule {}
