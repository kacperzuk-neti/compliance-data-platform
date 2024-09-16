import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../db/prisma.service';
import { getProviderClientsWeekly } from '../../../prisma/generated/client/sql';
import { groupBy } from 'lodash';
import { HistogramDto } from '../../types/histogram.dto';
import { ProviderClientsResponseDto } from '../../types/providerClients.response.dto';
import { HistogramWeekDto } from '../../types/histogramWeek.dto';

@Injectable()
export class ProviderService {
  constructor(private readonly prismaService: PrismaService) {}

  async getProviderClients() {
    const providerCount = await this.prismaService.$queryRaw<
      [
        {
          count: bigint;
        },
      ]
    >`select count(distinct provider)
      from client_provider_distribution_weekly`;

    const results = await this.prismaService.$queryRawTyped(
      getProviderClientsWeekly(),
    );

    const resultsByWeek = groupBy(results, (p) => p.week);

    const histogramWeekDtos: HistogramWeekDto[] = [];
    for (const key in resultsByWeek) {
      const value = resultsByWeek[key];
      const weekResponses = value.map((r) => {
        return new HistogramDto(
          r.value_from_exclusive,
          r.value_to_inclusive,
          r.week,
          r.count.toString(),
        );
      });
      histogramWeekDtos.push(
        new HistogramWeekDto(weekResponses[0].week, weekResponses),
      );
    }

    return new ProviderClientsResponseDto(
      Number(providerCount[0].count),
      histogramWeekDtos,
    );
  }
}
