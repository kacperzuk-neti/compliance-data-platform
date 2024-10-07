import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../db/prisma.service';
import {
  getProviderBiggestClientDistribution,
  getProviderClientsWeekly,
  getProviderRetrievability,
} from '../../../prisma/generated/client/sql';
import { RetrievabilityWeekResponseDto } from '../../types/retrievabilityWeekResponse.dto';
import { HistogramHelper } from '../../helper/histogram.helper';
import { differenceInCalendarDays } from 'date-fns';

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
    const providerWeeks = await this.prismaService.providers_weekly.findMany({
      select: {
        week: true,
      },
      orderBy: {
        week: 'desc',
      },
      where: {
        week: {
          lte: new Date(),
        },
      },
      skip: 0,
      take: 2,
    });

    const lastStoredFullWeek = providerWeeks.find(
      (p) => differenceInCalendarDays(new Date(), p.week) >= 7,
    );
    if (!lastStoredFullWeek) {
      throw new HttpException(
        'No data for full week present yet',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const providerCountAndAverageSuccessRate = await this.prismaService
      .$queryRaw<
      [
        {
          count: number;
          averageSuccessRate: number;
        },
      ]
    >`select count(distinct provider)::int,
             100 * avg(avg_retrievability_success_rate) as "averageSuccessRate"
      from providers_weekly where week = ${lastStoredFullWeek.week};`;

    const weeklyHistogramResult =
      await this.histogramHelper.getWeeklyHistogramResult(
        await this.prismaService.$queryRawTyped(getProviderRetrievability()),
        providerCountAndAverageSuccessRate[0].count,
      );

    return RetrievabilityWeekResponseDto.of(
      providerCountAndAverageSuccessRate[0].averageSuccessRate,
      weeklyHistogramResult,
    );
  }
}
