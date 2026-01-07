import { Controller, Get } from '@nestjs/common';

/**
 * Health check controller for load balancers and container orchestration
 * This is the only REST endpoint - all other operations use GraphQL
 */
@Controller()
export class AppController {
  @Get('health')
  healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'weddme-api',
    };
  }

  @Get()
  root() {
    return {
      message: 'Weddme API - GraphQL endpoint available at /graphql',
      graphql: '/graphql',
      health: '/health',
    };
  }
}
