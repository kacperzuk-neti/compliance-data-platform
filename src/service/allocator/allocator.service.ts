import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../db/prisma.service';
import {
  getAllocatorBiggestClientDistribution,
  getAllocatorRetrievability,
} from '../../../prisma/generated/client/sql';
import { HistogramHelper } from '../../helper/histogram.helper';
import { RetrievabilityWeekResponseDto } from '../../types/retrievabilityWeekResponse.dto';
import { groupBy } from 'lodash';
import { ProviderComplianceScoreRange } from '../../types/providerComplianceScoreRange';
import { SpsComplianceWeekResponseDto } from '../../types/spsComplianceWeekResponse.dto';
import { SpsComplianceWeekDto } from '../../types/spsComplianceWeek.dto';
import { DateTime } from 'luxon';

@Injectable()
export class AllocatorService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly histogramHelper: HistogramHelper,
  ) {}

  async getAllocatorRetrievability() {
    const averageSuccessRate =
      await this.prismaService.allocators_weekly.aggregate({
        _avg: {
          avg_weighted_retrievability_success_rate: true,
        },
        where: {
          week: DateTime.now()
            .toUTC()
            .minus({ week: 1 })
            .startOf('week')
            .toJSDate(),
        },
      });

    const allocatorCountResult = await this.prismaService.$queryRaw<
      [
        {
          count: number;
        },
      ]
    >`select count(distinct allocator)::int
      from client_allocator_distribution_weekly`;

    const weeklyHistogramResult =
      await this.histogramHelper.getWeeklyHistogramResult(
        await this.prismaService.$queryRawTyped(getAllocatorRetrievability()),
        allocatorCountResult[0].count,
      );

    return RetrievabilityWeekResponseDto.of(
      averageSuccessRate._avg.avg_weighted_retrievability_success_rate * 100,
      weeklyHistogramResult,
    );
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

    return await this.histogramHelper.getWeeklyHistogramResult(
      await this.prismaService.$queryRawTyped(
        getAllocatorBiggestClientDistribution(),
      ),
      allocatorCountResult[0].count,
    );
  }

  async getAllocatorSpsCompliance(): Promise<SpsComplianceWeekResponseDto> {
    const weeks = await this.prismaService.providers_weekly
      .findMany({
        distinct: ['week'],
        select: {
          week: true,
        },
      })
      .then((r) => r.map((p) => p.week));

    const allocatorCount = (
      await this.prismaService.allocators_weekly.findMany({
        distinct: ['allocator'],
        select: {
          allocator: true,
        },
      })
    ).length;

    const calculationResults: {
      results: {
        upToOneCompliantProvidersPercent: number;
        twoCompliantProvidersPercent: number;
        threeCompliantProvidersPercent: number;
      }[];
      week: Date;
    }[] = [];
    for (const week of weeks) {
      const thisWeekAverageRetrievability =
        await this.prismaService.providers_weekly.aggregate({
          _avg: {
            avg_retrievability_success_rate: true,
          },
          where: {
            week: week,
          },
        });

      const weekProviders = await this.prismaService.providers_weekly.findMany({
        where: {
          week: week,
        },
      });

      const weekProvidersCompliance = weekProviders.map((wp) => {
        let complianceScore = 0;
        if (
          wp.avg_retrievability_success_rate >
          thisWeekAverageRetrievability._avg.avg_retrievability_success_rate
        )
          complianceScore++;
        if (wp.num_of_clients > 3) complianceScore++;
        if (
          wp.biggest_client_total_deal_size * 100n <=
          30n * wp.total_deal_size
        )
          complianceScore++;

        return {
          provider: wp.provider,
          complianceScore: complianceScore,
        };
      });

      const weekAllocatorsWithClients =
        await this.prismaService.client_allocator_distribution_weekly.findMany({
          where: {
            week: week,
          },
          select: {
            client: true,
            allocator: true,
          },
        });

      const byAllocators = groupBy(
        weekAllocatorsWithClients,
        (a) => a.allocator,
      );

      const weekResult: {
        allocator: string;
        upToOneCompliantProvidersPercent: number;
        twoCompliantProvidersPercent: number;
        threeCompliantProvidersPercent: number;
      }[] = [];
      for (const allocator in byAllocators) {
        const clients = byAllocators[allocator].map((p) => p.client);

        const providers =
          await this.prismaService.client_provider_distribution_weekly
            .findMany({
              where: {
                week: week,
                client: {
                  in: clients,
                },
              },
              select: {
                provider: true,
              },
            })
            .then((r) => r.map((p) => p.provider));

        weekResult.push({
          allocator: allocator,
          upToOneCompliantProvidersPercent:
            this.getAllocatorCompliantProvidersPercentage(
              weekProvidersCompliance,
              providers,
              ProviderComplianceScoreRange.UpToOne,
            ),
          twoCompliantProvidersPercent:
            this.getAllocatorCompliantProvidersPercentage(
              weekProvidersCompliance,
              providers,
              ProviderComplianceScoreRange.Two,
            ),
          threeCompliantProvidersPercent:
            this.getAllocatorCompliantProvidersPercentage(
              weekProvidersCompliance,
              providers,
              ProviderComplianceScoreRange.Three,
            ),
        });
      }

      calculationResults.push({
        week: week,
        results: weekResult,
      });
    }

    return new SpsComplianceWeekResponseDto([
      await this.calculateSpsComplianceWeekDto(
        calculationResults,
        allocatorCount,
        ProviderComplianceScoreRange.UpToOne,
      ),
      await this.calculateSpsComplianceWeekDto(
        calculationResults,
        allocatorCount,
        ProviderComplianceScoreRange.Two,
      ),
      await this.calculateSpsComplianceWeekDto(
        calculationResults,
        allocatorCount,
        ProviderComplianceScoreRange.Three,
      ),
    ]);
  }

  private async calculateSpsComplianceWeekDto(
    calculationResults: {
      results: {
        upToOneCompliantProvidersPercent: number;
        twoCompliantProvidersPercent: number;
        threeCompliantProvidersPercent: number;
      }[];
      week: Date;
    }[],
    allocatorCount: number,
    providerComplianceScoreRange: ProviderComplianceScoreRange,
  ) {
    return SpsComplianceWeekDto.of(
      providerComplianceScoreRange,
      await this.histogramHelper.getWeeklyHistogramResult(
        this.getSpsComplianceBuckets(
          calculationResults,
          providerComplianceScoreRange,
        ),
        allocatorCount,
      ),
    );
  }

  private getSpsComplianceBuckets(
    unsortedResults: {
      results: {
        upToOneCompliantProvidersPercent: number;
        twoCompliantProvidersPercent: number;
        threeCompliantProvidersPercent: number;
      }[];
      week: Date;
    }[],
    providerComplianceScoreRange: ProviderComplianceScoreRange,
  ): {
    valueFromExclusive: number | null;
    valueToInclusive: number | null;
    count: number | null;
    week: Date;
  }[] {
    let valueFromExclusive = -5;
    const result: {
      valueFromExclusive: number | null;
      valueToInclusive: number | null;
      count: number | null;
      week: Date;
    }[] = [];
    do {
      result.push(
        ...unsortedResults.map((r) => {
          const count = r.results.filter(
            (p) =>
              this.getPercentValue(p, providerComplianceScoreRange) >
                valueFromExclusive &&
              this.getPercentValue(p, providerComplianceScoreRange) <=
                valueFromExclusive + 5,
          ).length;

          return {
            valueFromExclusive: valueFromExclusive,
            valueToInclusive: valueFromExclusive + 5,
            week: r.week,
            count: count,
          };
        }),
      );

      valueFromExclusive += 5;
    } while (valueFromExclusive < 95);

    return result;
  }

  private getPercentValue(
    result: {
      upToOneCompliantProvidersPercent: number;
      twoCompliantProvidersPercent: number;
      threeCompliantProvidersPercent: number;
    },
    providerComplianceScoreRange: ProviderComplianceScoreRange,
  ) {
    switch (providerComplianceScoreRange) {
      case ProviderComplianceScoreRange.UpToOne:
        return result.upToOneCompliantProvidersPercent;
      case ProviderComplianceScoreRange.Two:
        return result.twoCompliantProvidersPercent;
      case ProviderComplianceScoreRange.Three:
        return result.threeCompliantProvidersPercent;
    }
  }

  private getAllocatorCompliantProvidersPercentage(
    weekProvidersCompliance: {
      complianceScore: number;
      provider: string;
    }[],
    providers: string[],
    complianceScore: ProviderComplianceScoreRange,
  ) {
    const validComplianceScores: number[] = [];
    switch (complianceScore) {
      case ProviderComplianceScoreRange.UpToOne:
        validComplianceScores.push(0, 1);
        break;
      case ProviderComplianceScoreRange.Two:
        validComplianceScores.push(2);
        break;
      case ProviderComplianceScoreRange.Three:
        validComplianceScores.push(3);
        break;
    }

    return (
      (100 *
        weekProvidersCompliance.filter(
          (p) =>
            providers.includes(p.provider) &&
            validComplianceScores.includes(p.complianceScore),
        ).length) /
      weekProvidersCompliance.length
    );
  }
}
