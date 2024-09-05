import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AggregationTasksService } from './aggregation/aggregation-tasks.service';
import { AggregationService } from './aggregation/aggregation.service';
import { PrismaService } from './db/prisma.service';
import { PrismaDmobService } from './db/prismaDmob.service';
import { ProviderRunner } from './aggregation/runners/provider.runner';
import { ReplicaDistributionRunner } from './aggregation/runners/replica-disctribution.runner';

@Module({
  imports: [ConfigModule.forRoot(), ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [
    AppService,
    AggregationService,
    AggregationTasksService,
    PrismaService,
    PrismaDmobService,
    ProviderRunner,
    ReplicaDistributionRunner,
    {
      provide: 'AggregationRunner',
      useFactory: (providerRunner, replicaDistributionRunner) => [
        providerRunner,
        replicaDistributionRunner,
      ],
      inject: [ProviderRunner, ReplicaDistributionRunner],
    },
  ],
})
export class AppModule {}
