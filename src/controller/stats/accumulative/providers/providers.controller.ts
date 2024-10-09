import { Controller, Get } from '@nestjs/common';
import { ProviderService } from '../../../../service/provider/provider.service';

@Controller('stats/acc/providers')
export class ProvidersAccController {
  constructor(private readonly providerAccService: ProviderService) {}

  @Get('clients')
  async getProviderClients() {
    return await this.providerAccService.getProviderClients(true);
  }

  @Get('biggest-client-distribution')
  async getProviderBiggestClientDistribution() {
    return await this.providerAccService.getProviderBiggestClientDistribution(
      true,
    );
  }

  @Get('retrievability')
  async getProviderRetrievability() {
    return await this.providerAccService.getProviderRetrievability(true);
  }
}
