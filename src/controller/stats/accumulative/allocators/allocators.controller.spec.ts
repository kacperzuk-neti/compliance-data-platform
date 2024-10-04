import { Test, TestingModule } from '@nestjs/testing';
import { AllocatorsAccController } from './allocators.controller';

describe('AllocatorsAccController', () => {
  let controller: AllocatorsAccController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AllocatorsAccController],
    }).compile();

    controller = module.get<AllocatorsAccController>(AllocatorsAccController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
