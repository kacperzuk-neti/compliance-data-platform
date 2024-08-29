import { Test, TestingModule } from '@nestjs/testing';
import { AggregationTasksService } from './aggregation-tasks.service';

describe('AggregationTasksService', () => {
  let service: AggregationTasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AggregationTasksService],
    }).compile();

    service = module.get<AggregationTasksService>(AggregationTasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
