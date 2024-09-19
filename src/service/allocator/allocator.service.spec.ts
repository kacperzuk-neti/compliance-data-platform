import { Test, TestingModule } from '@nestjs/testing';
import { AllocatorService } from './allocator.service';

describe('AllocatorService', () => {
  let service: AllocatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AllocatorService],
    }).compile();

    service = module.get<AllocatorService>(AllocatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
