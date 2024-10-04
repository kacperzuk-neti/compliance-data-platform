import { Test, TestingModule } from '@nestjs/testing';
import { AllocatorAccService } from './allocator.service';

describe('AllocatorAccService', () => {
  let service: AllocatorAccService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AllocatorAccService],
    }).compile();

    service = module.get<AllocatorAccService>(AllocatorAccService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
