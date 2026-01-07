import { Injectable, Logger } from '@nestjs/common';
import { GraphQLError } from 'graphql';

export interface GraphQLErrorContext {
    fieldName?: string;
    operation?: string;
    path?: any;
    variables?: any;
    userId?: string;
    ip?: string;
}

@Injectable()
export class GraphQLErrorLogger {
    private readonly logger = new Logger('GraphQL');

    /**
     * Log GraphQL errors with full context
     */
    logError(
        error: any,
        context: GraphQLErrorContext,
    ): void {
        const errorInfo = {
            message: error?.message || 'Unknown error',
            name: error?.name || 'Error',
            code: error?.extensions?.code || 'INTERNAL_SERVER_ERROR',
            field: context.fieldName,
            operation: context.operation,
            path: context.path,
            variables: context.variables,
            userId: context.userId,
            ip: context.ip,
            timestamp: new Date().toISOString(),
            stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined,
        };

        // Log based on error type
        if (this.isValidationError(error)) {
            this.logger.warn(`Validation Error: ${errorInfo.message}`, errorInfo);
        } else if (this.isAuthenticationError(error)) {
            this.logger.warn(`Authentication Error: ${errorInfo.message}`, errorInfo);
        } else if (this.isAuthorizationError(error)) {
            this.logger.warn(`Authorization Error: ${errorInfo.message}`, errorInfo);
        } else {
            this.logger.error(`GraphQL Error: ${errorInfo.message}`, errorInfo);
        }
    }

    /**
     * Log successful operations (optional, for audit trail)
     */
    logOperation(
        fieldName: string,
        operation: string,
        context: {
            userId?: string;
            variables?: any;
            executionTime?: number;
        },
    ): void {
        if (process.env.GRAPHQL_LOG_OPERATIONS === 'true') {
            this.logger.log(`${operation} ${fieldName}`, {
                field: fieldName,
                operation,
                userId: context.userId,
                variables: context.variables,
                executionTime: context.executionTime,
                timestamp: new Date().toISOString(),
            });
        }
    }

    private isValidationError(error: any): boolean {
        return (
            error?.extensions?.code === 'BAD_USER_INPUT' ||
            error?.extensions?.code === 'GRAPHQL_VALIDATION_FAILED' ||
            error?.message?.toLowerCase().includes('validation')
        );
    }

    private isAuthenticationError(error: any): boolean {
        return (
            error?.extensions?.code === 'UNAUTHENTICATED' ||
            error?.message?.toLowerCase().includes('unauthorized') ||
            error?.message?.toLowerCase().includes('unauthenticated')
        );
    }

    private isAuthorizationError(error: any): boolean {
        return (
            error?.extensions?.code === 'FORBIDDEN' ||
            error?.message?.toLowerCase().includes('forbidden') ||
            error?.message?.toLowerCase().includes('permission')
        );
    }
}
