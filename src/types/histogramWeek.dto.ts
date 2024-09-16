import { HistogramDto } from './histogram.dto';

export class HistogramWeekDto {
  week: Date;
  results: HistogramDto[];

  constructor(week: Date, results: HistogramDto[]) {
    this.week = week;
    this.results = results;
  }
}
