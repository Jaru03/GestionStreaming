import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ClientsModule } from './clients/clients.module';
import { ServicesModule } from './services/services.module';
import { ScreensModule } from './screens/screens.module';
import { AccountsModule } from './accounts/accounts.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';

@Module({
  imports: [ ClientsModule, ServicesModule, ScreensModule, AccountsModule, PrismaModule, SubscriptionsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
