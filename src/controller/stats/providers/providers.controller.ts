import { Controller, Get } from '@nestjs/common';
import { ProviderService } from '../../../service/provider/provider.service';

@Controller('stats/providers')
export class ProvidersController {
  constructor(private readonly providerService: ProviderService) {}

  @Get('clients')
  getProviderClients() {
    return this.providerService.getProviderClients();
  }
}
