import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProxyModule } from './proxy/proxy.module';
import { CoreModule } from './modules/core/core.module';
import { AuthModule } from './modules/auth/auth.module';
import { BelvoModule } from './modules/belvo/belvo.module';
import appConfig from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    ProxyModule,
    CoreModule,
    AuthModule,
    BelvoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
