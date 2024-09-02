import { Injectable, Logger } from '@nestjs/common';
import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';
import { PrismaDmobService } from '../db/prismaDmob.service';

@Injectable()
export class AggregationService {
  private readonly logger = new Logger(AggregationService.name);
  private readonly dmobPostgresPool: Pool;

  constructor(
    private readonly configService: ConfigService,
    private readonly prismaDmobService: PrismaDmobService,
  ) {
    this.dmobPostgresPool = new Pool({
      connectionString: configService.get<string>('DMOB_DATABASE_URL'),
    });
  }

  async runAggregations() {
    console.log(await this.prismaDmobService.api_key.findMany());
  }
}
