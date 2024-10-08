import { ProviderComplianceScoreRange } from './providerComplianceScoreRange';
import { HistogramWeekResponseDto } from './histogramWeek.response.dto';

export class SpsComplianceWeekDto {
  scoreRange: ProviderComplianceScoreRange;
  histogram: HistogramWeekResponseDto;

  public static of(
    scoreRange: ProviderComplianceScoreRange,
    histogram: HistogramWeekResponseDto,
  ) {
    const dto = new SpsComplianceWeekDto();

    dto.scoreRange = scoreRange;
    dto.histogram = histogram;

    return dto;
  }
}
