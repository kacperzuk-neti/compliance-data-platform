import { HistogramWeekResponseDto } from './histogramWeek.response.dto';

export class ProviderRetrievabilityWeekResponseDto {
  averageSuccessRate: number;
  histogram: HistogramWeekResponseDto;

  public static of(
    averageSuccessRate: number,
    histogram: HistogramWeekResponseDto,
  ): ProviderRetrievabilityWeekResponseDto {
    const dto = new ProviderRetrievabilityWeekResponseDto();

    dto.averageSuccessRate = averageSuccessRate;
    dto.histogram = histogram;

    return dto;
  }
}
