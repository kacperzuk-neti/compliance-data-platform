import { Test, TestingModule } from '@nestjs/testing';
import { AllocatorsController } from './allocators.controller';

describe('AllocatorsController', () => {
  let controller: AllocatorsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AllocatorsController],
    }).compile();

    controller = module.get<AllocatorsController>(AllocatorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
