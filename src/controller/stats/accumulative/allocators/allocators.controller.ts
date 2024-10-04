import { Controller, Get } from '@nestjs/common';
import { AllocatorAccService } from '../../../../service/accumulative/allocator/allocator.service';

@Controller('stats/acc/allocators')
export class AllocatorsAccController {
  constructor(private readonly allocatorAccService: AllocatorAccService) {}

  @Get('retrievability')
  async getAllocatorRetrievability() {
    return await this.allocatorAccService.getAllocatorRetrievability();
  }

  @Get('biggest-client-distribution')
  async getAllocatorBiggestClientDistribution() {
    return await this.allocatorAccService.getAllocatorBiggestClientDistribution();
  }

  @Get('sps-compliance')
  async getAllocatorSpsCompliance() {
    return await this.allocatorAccService.getAllocatorSpsCompliance();
  }
}
