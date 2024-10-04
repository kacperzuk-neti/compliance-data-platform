import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../db/prisma.service';
import {
  getProviderBiggestClientDistributionAcc,
  getProviderClientsWeeklyAcc,
  getProviderRetrievabilityAcc,
} from '../../../../prisma/generated/client/sql';
import { RetrievabilityWeekResponseDto } from '../../../types/retrievabilityWeekResponse.dto';
import { HistogramHelper } from '../../../helper/histogram.helper';

@Injectable()
export class ProviderAccService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly histogramHelper: HistogramHelper,
  ) {}

  async getProviderClients() {
    const providerCountResult = await this.prismaService.$queryRaw<
      [
        {
          count: number;
        },
      ]
    >`select count(distinct provider)::int
      from client_provider_distribution_weekly_acc`;

    return await this.histogramHelper.getWeeklyHistogramResult(
      await this.prismaService.$queryRawTyped(getProviderClientsWeeklyAcc()),
      providerCountResult[0].count,
    );
  }

  async getProviderBiggestClientDistribution() {
    const providerCountResult = await this.prismaService.$queryRaw<
      [
        {
          count: number;
        },
      ]
    >`select count(distinct provider)::int
      from client_provider_distribution_weekly_acc`;

    return await this.histogramHelper.getWeeklyHistogramResult(
      await this.prismaService.$queryRawTyped(
        getProviderBiggestClientDistributionAcc(),
      ),
      providerCountResult[0].count,
    );
  }

  async getProviderRetrievability() {
    const providerCountAndAverageSuccessRate = await this.prismaService
      .$queryRaw<
      [
        {
          count: number;
          averageSuccessRate: number;
        },
      ]
    >`select count(distinct provider)::int,
             100 * avg(success_rate) as "averageSuccessRate"
      from provider_retrievability_daily;`;
    // FIXME take only last full week here
    // FIXME switch to providers_weekly_acc

    const weeklyHistogramResult =
      await this.histogramHelper.getWeeklyHistogramResult(
        await this.prismaService.$queryRawTyped(getProviderRetrievabilityAcc()),
        providerCountAndAverageSuccessRate[0].count,
      );

    return RetrievabilityWeekResponseDto.of(
      providerCountAndAverageSuccessRate[0].averageSuccessRate,
      weeklyHistogramResult,
    );
  }
}
