import { Injectable, Logger } from '@nestjs/common';
import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AggregationService {
  private readonly logger = new Logger(AggregationService.name);
  private readonly dmobPostgresPool: Pool;

  constructor(private readonly configService: ConfigService) {
    this.dmobPostgresPool = new Pool({
      connectionString: configService.get<string>('DMOB_DATABASE_URL'),
    });
  }

  async runAggregations() {
    this.dmobPostgresPool.connect((err, client, done) => {
      client.query('Select * from api_key', (err, result) => {
        done();

        console.log(result);

        if (err) {
          this.logger.error(`Error running aggregation query: ${err.message}`);
        }
      });
    });
  }
}
