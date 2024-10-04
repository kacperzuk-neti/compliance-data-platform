import { Controller, Get } from '@nestjs/common';
import { ProviderAccService } from '../../../../service/accumulative/provider/provider.service';

@Controller('stats/acc/providers')
export class ProvidersAccController {
  constructor(private readonly providerAccService: ProviderAccService) {}

  @Get('clients')
  async getProviderClients() {
    return await this.providerAccService.getProviderClients();
  }

  @Get('biggest-client-distribution')
  async getProviderBiggestClientDistribution() {
    return await this.providerAccService.getProviderBiggestClientDistribution();
  }

  @Get('retrievability')
  async getProviderRetrievability() {
    return await this.providerAccService.getProviderRetrievability();
  }
}
