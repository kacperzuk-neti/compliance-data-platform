import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../db/prisma.service';
import {
  getProviderBiggestClientDistribution,
  getProviderClientsWeekly,
} from '../../../prisma/generated/client/sql';
import { groupBy } from 'lodash';
import { HistogramDto } from '../../types/histogram.dto';
import { HistogramWeekDto } from '../../types/histogramWeek.dto';
import { HistogramWeekResponseDto } from '../../types/histogramWeek.response.dto';

@Injectable()
export class ProviderService {
  constructor(private readonly prismaService: PrismaService) {}

  async getProviderClients() {
    return this.getWeeklyHistogramResult(
      await this.prismaService.$queryRawTyped(getProviderClientsWeekly()),
    );
  }

  async getProviderBiggestClientDistribution() {
    return this.getWeeklyHistogramResult(
      await this.prismaService.$queryRawTyped(
        getProviderBiggestClientDistribution(),
      ),
    );
  }

  private async getWeeklyHistogramResult(
    results: {
      value_from_exclusive: number | null;
      value_to_inclusive: number | null;
      count: number | null;
      week: Date;
    }[],
  ) {
    const providerCount = await this.prismaService.$queryRaw<
      [
        {
          count: number;
        },
      ]
    >`select count(distinct provider)::int
      from client_provider_distribution_weekly`;

    const resultsByWeek = groupBy(results, (p) => p.week);

    const histogramWeekDtos: HistogramWeekDto[] = [];
    for (const key in resultsByWeek) {
      const value = resultsByWeek[key];
      const weekResponses = value.map((r) => {
        return new HistogramDto(
          r.value_from_exclusive,
          r.value_to_inclusive,
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

    return new HistogramWeekResponseDto(
      providerCount[0].count,
      histogramWeekDtos,
    );
  }
}
