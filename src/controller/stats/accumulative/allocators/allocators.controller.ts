import { Controller, Get } from '@nestjs/common';
import { AllocatorService } from '../../../../service/allocator/allocator.service';

@Controller('stats/acc/allocators')
export class AllocatorsAccController {
  constructor(private readonly allocatorAccService: AllocatorService) {}

  @Get('retrievability')
  async getAllocatorRetrievability() {
    return await this.allocatorAccService.getAllocatorRetrievability(true);
  }

  @Get('biggest-client-distribution')
  async getAllocatorBiggestClientDistribution() {
    return await this.allocatorAccService.getAllocatorBiggestClientDistribution(true);
  }

  @Get('sps-compliance')
  async getAllocatorSpsCompliance() {
    return await this.allocatorAccService.getAllocatorSpsCompliance(true);
  }
}
