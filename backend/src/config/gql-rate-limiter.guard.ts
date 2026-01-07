import { Injectable, ExecutionContext, CanActivate, HttpException, HttpStatus } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { RateLimiterMemory } from 'rate-limiter-flexible';

/**
 * Custom rate limiter guard that works with both REST and GraphQL contexts.
 * Replaces nestjs-rate-limiter's guard to properly handle GraphQL requests.
 */
@Injectable()
export class GqlRateLimiterGuard implements CanActivate {
    private rateLimiter: RateLimiterMemory;

    constructor() {
        this.rateLimiter = new RateLimiterMemory({
            points: 100, // Number of requests
            duration: 60, // Per 60 seconds
        });
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = this.getRequest(context);

        // If we can't get a request object, allow the request
        if (!request) {
            return true;
        }

        const ip = this.extractIp(request);

        try {
            await this.rateLimiter.consume(ip);
            return true;
        } catch (error) {
            throw new HttpException(
                {
                    statusCode: HttpStatus.TOO_MANY_REQUESTS,
                    message: 'Too many requests. Please try again later.',
                },
                HttpStatus.TOO_MANY_REQUESTS,
            );
        }
    }

    private getRequest(context: ExecutionContext): any {
        const type = context.getType<string>();

        if (type === 'graphql') {
            const gqlContext = GqlExecutionContext.create(context);
            const ctx = gqlContext.getContext();
            return ctx?.req;
        }

        // For HTTP/REST requests
        return context.switchToHttp().getRequest();
    }

    private extractIp(request: any): string {
        if (!request) {
            return 'unknown';
        }

        return (
            request.ip ||
            request.connection?.remoteAddress ||
            request.socket?.remoteAddress ||
            request.headers?.['x-forwarded-for']?.split(',')[0]?.trim() ||
            request.headers?.['x-real-ip'] ||
            '127.0.0.1'
        );
    }
}
