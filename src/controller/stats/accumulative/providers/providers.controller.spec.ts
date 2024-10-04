import { Test, TestingModule } from '@nestjs/testing';
import { ProvidersAccController } from './providers.controller';

describe('ProvidersAccController', () => {
  let controller: ProvidersAccController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProvidersAccController],
    }).compile();

    controller = module.get<ProvidersAccController>(ProvidersAccController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
