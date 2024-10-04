import { Test, TestingModule } from '@nestjs/testing';
import { ProviderAccService } from './provider.service';

describe('ProviderAccService', () => {
  let service: ProviderAccService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProviderAccService],
    }).compile();

    service = module.get<ProviderAccService>(ProviderAccService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
