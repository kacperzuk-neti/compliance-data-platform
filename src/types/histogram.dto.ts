export class HistogramDto {
  valueFromExclusive: number | null;
  valueToInclusive: number | null;
  count: number | null;

  constructor(
    valueFromExclusive: number | null,
    valueToInclusive: number | null,
    count: number | null,
  ) {
    this.valueFromExclusive = valueFromExclusive;
    this.valueToInclusive = valueToInclusive;
    this.count = count;
  }
}
