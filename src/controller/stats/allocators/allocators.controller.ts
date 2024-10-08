import { Controller, Get } from '@nestjs/common';
import { AllocatorService } from '../../../service/allocator/allocator.service';

@Controller('stats/allocators')
export class AllocatorsController {
  constructor(private readonly allocatorService: AllocatorService) {}

  @Get('retrievability')
  async getAllocatorRetrievability() {
    return await this.allocatorService.getAllocatorRetrievability();
  }

  @Get('biggest-client-distribution')
  async getAllocatorBiggestClientDistribution() {
    return await this.allocatorService.getAllocatorBiggestClientDistribution();
  }

  @Get('sps-compliance')
  async getAllocatorSpsCompliance() {
    return await this.allocatorService.getAllocatorSpsCompliance();
  }
}
