import { SpsComplianceWeekDto } from './spsComplianceWeek.dto';

export class SpsComplianceWeekResponseDto {
  results: SpsComplianceWeekDto[];

  constructor(results: SpsComplianceWeekDto[]) {
    this.results = results;
  }
}
