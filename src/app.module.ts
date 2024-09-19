import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AggregationTasksService } from './aggregation/aggregation-tasks.service';
import { AggregationService } from './aggregation/aggregation.service';
import { PrismaService } from './db/prisma.service';
import { PrismaDmobService } from './db/prismaDmob.service';

import { AllocatorsRunner } from './aggregation/runners/allocators.runner';
import { CidSharingRunner } from './aggregation/runners/cid-sharing.runner';
import { ClientAllocatorDistributionRunner } from './aggregation/runners/client-allocator-distribution.runner';
import { ClientClaimsRunner } from './aggregation/runners/client-claims.runner';
import { ClientProviderDistributionRunner } from './aggregation/runners/client-provider-distribution.runner';
import { ClientReplicaDistributionRunner } from './aggregation/runners/client-replica-distribution.runner';
import { ProviderFirstClientRunner } from './aggregation/runners/provider-first-client.runner';
import { ProviderRetrievabilityRunner } from './aggregation/runners/provider-retrievability.runner';
import { ProvidersRunner } from './aggregation/runners/providers.runner';
import { UnifiedVerifiedDealRunner } from './aggregation/runners/unified-verified-deal.runner';
import { HttpModule } from '@nestjs/axios';
import { FilSparkService } from './filspark/filspark.service';
import { ProvidersController } from './controller/stats/providers/providers.controller';
import { ProviderService } from './service/provider/provider.service';
import { AllocatorsController } from './controller/stats/allocators/allocators.controller';
import { AllocatorService } from './service/allocator/allocator.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    HttpModule.register({ timeout: 5000 }),
  ],
  controllers: [ProvidersController, AllocatorsController],
  providers: [
    AggregationService,
    AggregationTasksService,
    PrismaService,
    PrismaDmobService,
    FilSparkService,
    AllocatorsRunner,
    CidSharingRunner,
    ClientAllocatorDistributionRunner,
    ClientClaimsRunner,
    ClientProviderDistributionRunner,
    ClientReplicaDistributionRunner,
    ProviderFirstClientRunner,
    ProviderRetrievabilityRunner,
    ProvidersRunner,
    UnifiedVerifiedDealRunner,
    ProviderService,
    AllocatorService,
    {
      provide: 'AggregationRunner',
      useFactory: (
        allocatorsRunner,
        cidSharingRunner,
        clientAllocatorDistributionRunner,
        clientClaimsRunner,
        clientProviderDistributionRunner,
        clientReplicaDistributionRunner,
        providerFirstClientRunner,
        providerRetrievabilityRunner,
        providersRunner,
        unifiedVerifiedDealRunner,
      ) => [
        allocatorsRunner,
        cidSharingRunner,
        clientAllocatorDistributionRunner,
        clientClaimsRunner,
        clientProviderDistributionRunner,
        clientReplicaDistributionRunner,
        providerFirstClientRunner,
        providerRetrievabilityRunner,
        providersRunner,
        unifiedVerifiedDealRunner,
      ],
      inject: [
        AllocatorsRunner,
        CidSharingRunner,
        ClientAllocatorDistributionRunner,
        ClientClaimsRunner,
        ClientProviderDistributionRunner,
        ClientReplicaDistributionRunner,
        ProviderFirstClientRunner,
        ProviderRetrievabilityRunner,
        ProvidersRunner,
        UnifiedVerifiedDealRunner,
      ],
    },
  ],
})
export class AppModule {}
