import { AmqpModuleOptions, AmqpOptionsFactory } from '@fiap-burger/amqp';
import { toDottedNotation } from '@fiap-burger/amqp/utils/amqp-infrastructure.util';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const withPrefix = (value: string) =>
  `${toDottedNotation('FiapBurgerOrder')}.${toDottedNotation(value)}`;

@Injectable()
export class AmqpConfig implements AmqpOptionsFactory {
  constructor(private readonly config: ConfigService) {}

  createAmqpOptions(): AmqpModuleOptions {
    const [appName, url, inspectionMode, isCI] = [
      this.config.getOrThrow('APP_NAME'),
      this.config.getOrThrow('AMQP_URL'),
      this.config.get('TRAFFIC_INSPECTION_AMQP', 'all'),
      this.config.get('CI', false),
    ];
    return {
      url,
      appName,
      prefix: 'FiapBurgerOrder',
      trafficInspection: { mode: inspectionMode },
      waitForConnection: isCI,
      exchanges: [
        // ::StyleKeep::
        { name: withPrefix('events') },
      ],
    };
  }
}
