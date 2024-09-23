import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../db/prisma.service';
import {
  getAllocatorBiggestClientDistribution,
} from '../../../prisma/generated/client/sql';
import { groupBy } from 'lodash';
import { HistogramDto } from '../../types/histogram.dto';
import { HistogramWeekDto } from '../../types/histogramWeek.dto';
import { HistogramWeekResponseDto } from '../../types/histogramWeek.response.dto';

@Injectable()
export class AllocatorService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllocatorRetrievability() {
    // todo: implement
  }

  async getAllocatorBiggestClientDistribution() {
    const allocatorCountResult = await this.prismaService.$queryRaw<
      [
        {
          count: number;
        },
      ]
    >`select count(distinct allocator)::int
      from client_allocator_distribution_weekly`;

    return this.getWeeklyHistogramResult(
      await this.prismaService.$queryRawTyped(
        getAllocatorBiggestClientDistribution(),
      ),
      allocatorCountResult[0].count,
    );
  }

  async getAllocatorSpsCompliance() {
    // todo: implement
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
