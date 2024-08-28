import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PORTALS_URL } from 'src/common/constants';

@Injectable()
export class PortalsService {
  constructor(private readonly configService: ConfigService) {}

  async getBalance(owner: string, networks: string[]) {
    let networksQuery = '';

    networks.forEach((network) => (networksQuery += '&networks=' + network));

    const data = await fetch(
      `${PORTALS_URL}/account?owner=${owner}${networksQuery}`,
      {
        headers: {
          Authorization: `Bearer ${this.configService.get<string>('PORTALS_BEARER_TOKEN')}`,
        },
      },
    );

    const response = await data.json();

    return response.balances;
  }
}
