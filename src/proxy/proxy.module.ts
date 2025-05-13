import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CoreProxy } from './core.proxy';
import { AuthProxy } from './auth.proxy';
import { BelvoProxy } from './belvo.proxy';

@Module({
  imports: [HttpModule],
  providers: [CoreProxy, AuthProxy, BelvoProxy],
  exports: [CoreProxy, AuthProxy, BelvoProxy],
})
export class ProxyModule {}
