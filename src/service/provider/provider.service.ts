import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../db/prisma.service';
import {
  getProviderBiggestClientDistribution,
  getProviderClientsWeekly,
  getProviderRetrievability,
} from '../../../prisma/generated/client/sql';
import { ProviderRetrievabilityWeekResponseDto } from '../../types/providerRetrievabilityWeek.response.dto';
import { HistogramHelper } from '../../helper/histogram.helper';

@Injectable()
export class ProviderService {
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
      from client_provider_distribution_weekly`;

    return await this.histogramHelper.getWeeklyHistogramResult(
      await this.prismaService.$queryRawTyped(getProviderClientsWeekly()),
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
      from client_provider_distribution_weekly`;

    return await this.histogramHelper.getWeeklyHistogramResult(
      await this.prismaService.$queryRawTyped(
        getProviderBiggestClientDistribution(),
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

    const weeklyHistogramResult =
      await this.histogramHelper.getWeeklyHistogramResult(
        await this.prismaService.$queryRawTyped(getProviderRetrievability()),
        providerCountAndAverageSuccessRate[0].count,
      );

    return ProviderRetrievabilityWeekResponseDto.of(
      providerCountAndAverageSuccessRate[0].averageSuccessRate,
      weeklyHistogramResult,
    );
  }
}
