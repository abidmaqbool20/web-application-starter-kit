import { RateLimiterModule } from 'nestjs-rate-limiter';
import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const rateLimiterConfig: RateLimiterModule = {
  // Configure your rate limiter options here 
  points: 20, // Number of points
  duration: 60, // Duration in seconds
  // Custom key generator to handle both REST and GraphQL requests
  keyPrefix: 'rate-limit',
  customResponseSchema: (rateLimiterResponse) => ({
    statusCode: 429,
    message: 'Too many requests',
  }),
};
