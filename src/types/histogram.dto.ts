export class HistogramDto {
  valueFromExclusive: number | null;
  valueToExclusive: number | null;
  week: Date;
  count: string | null;

  constructor(
    valueFromExclusive: number | null,
    valueToExclusive: number | null,
    week: Date,
    count: string | null,
  ) {
    this.valueFromExclusive = valueFromExclusive;
    this.valueToExclusive = valueToExclusive;
    this.week = week;
    this.count = count;
  }
}
