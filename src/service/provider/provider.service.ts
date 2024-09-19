import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../db/prisma.service';
import {
  getProviderBiggestClientDistribution,
  getProviderClientsWeekly,
  getProviderRetrievability,
} from '../../../prisma/generated/client/sql';
import { groupBy } from 'lodash';
import { HistogramDto } from '../../types/histogram.dto';
import { HistogramWeekDto } from '../../types/histogramWeek.dto';
import { HistogramWeekResponseDto } from '../../types/histogramWeek.response.dto';
import { ProviderRetrievabilityWeekResponseDto } from '../../types/providerRetrievabilityWeek.response.dto';

@Injectable()
export class ProviderService {
  constructor(private readonly prismaService: PrismaService) {}

  async getProviderClients() {
    const providerCountResult = await this.prismaService.$queryRaw<
      [
        {
          count: number;
        },
      ]
    >`select count(distinct provider)::int
      from client_provider_distribution_weekly`;

    return this.getWeeklyHistogramResult(
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

    return this.getWeeklyHistogramResult(
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

    const weeklyHistogramResult = await this.getWeeklyHistogramResult(
      await this.prismaService.$queryRawTyped(getProviderRetrievability()),
      providerCountAndAverageSuccessRate[0].count,
    );

    return ProviderRetrievabilityWeekResponseDto.of(
      providerCountAndAverageSuccessRate[0].averageSuccessRate,
      weeklyHistogramResult,
    );
  }

  private async getWeeklyHistogramResult(
    results: {
      valueFromExclusive: number | null;
      valueToInclusive: number | null;
      count: number | null;
      week: Date;
    }[],
    totalCount: number,
  ) {
    const resultsByWeek = groupBy(results, (p) => p.week);

    const histogramWeekDtos: HistogramWeekDto[] = [];
    for (const key in resultsByWeek) {
      const value = resultsByWeek[key];
      const weekResponses = value.map((r) => {
        return new HistogramDto(
          r.valueFromExclusive,
          r.valueToInclusive,
          r.count,
        );
      });
      histogramWeekDtos.push(
        new HistogramWeekDto(
          new Date(key),
          weekResponses,
          weekResponses.reduce(
            (partialSum, response) => partialSum + response.count,
            0,
          ),
        ),
      );
    }

    return new HistogramWeekResponseDto(totalCount, histogramWeekDtos);
  }
}
