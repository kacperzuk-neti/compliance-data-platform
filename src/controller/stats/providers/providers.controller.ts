import { Controller, Get } from '@nestjs/common';
import { ProviderService } from '../../../service/provider/provider.service';

@Controller('stats/providers')
export class ProvidersController {
  constructor(private readonly providerService: ProviderService) {}

  @Get('clients')
  async getProviderClients() {
    return await this.providerService.getProviderClients(false);
  }

  @Get('biggest-client-distribution')
  async getProviderBiggestClientDistribution() {
    return await this.providerService.getProviderBiggestClientDistribution(
      false,
    );
  }

  @Get('retrievability')
  async getProviderRetrievability() {
    return await this.providerService.getProviderRetrievability(false);
  }
}
