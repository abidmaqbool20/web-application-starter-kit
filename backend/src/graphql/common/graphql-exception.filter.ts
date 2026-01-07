import { Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { GraphQLErrorLogger } from './graphql-error-logger.service';

@Catch()
export class GraphQLExceptionFilter implements GqlExceptionFilter {
    constructor(private readonly errorLogger: GraphQLErrorLogger) {}

    catch(exception: any, host: ArgumentsHost) {
        const gqlHost = GqlArgumentsHost.create(host);
        const info = gqlHost.getInfo();
        const context = gqlHost.getContext();

        // Extract user info from context if available
        const userId = context?.req?.user?.sub || context?.req?.user?.id;
        const ip = context?.req?.ip || context?.req?.connection?.remoteAddress;

        // Determine error code and message
        const { code, message, statusCode } = this.extractErrorInfo(exception);

        // Log the error with full context
        this.errorLogger.logError(exception, {
            fieldName: info?.fieldName,
            operation: info?.operation?.operation,
            path: info?.path,
            variables: context?.req?.body?.variables,
            userId,
            ip,
        });

        // Return formatted GraphQL error
        return new GraphQLError(message, {
            extensions: {
                code,
                statusCode,
                timestamp: new Date().toISOString(),
                path: info?.path,
                // Only include stack trace in development
                ...(process.env.NODE_ENV === 'development' && {
                    stack: exception?.stack,
                }),
            },
        });
    }

    private extractErrorInfo(exception: any): {
        code: string;
        message: string;
        statusCode: number;
    } {
        // Handle HttpException
        if (exception instanceof HttpException) {
            const status = exception.getStatus();
            return {
                code: this.getErrorCode(status),
                message: exception.message,
                statusCode: status,
            };
        }

        // Handle GraphQL errors
        if (exception instanceof GraphQLError) {
            return {
                code: exception.extensions?.code as string || 'INTERNAL_SERVER_ERROR',
                message: exception.message,
                statusCode: this.getStatusCode(exception.extensions?.code as string),
            };
        }

        // Handle validation errors
        if (exception?.response?.message && Array.isArray(exception.response.message)) {
            return {
                code: 'BAD_USER_INPUT',
                message: exception.response.message.join(', '),
                statusCode: HttpStatus.BAD_REQUEST,
            };
        }

        // Handle TypeORM errors
        if (exception?.name === 'QueryFailedError') {
            return {
                code: 'DATABASE_ERROR',
                message: this.sanitizeDatabaseError(exception.message),
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            };
        }

        // Default error
        return {
            code: 'INTERNAL_SERVER_ERROR',
            message: exception?.message || 'An unexpected error occurred',
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        };
    }

    private getErrorCode(statusCode: number): string {
        const codeMap: Record<number, string> = {
            [HttpStatus.BAD_REQUEST]: 'BAD_USER_INPUT',
            [HttpStatus.UNAUTHORIZED]: 'UNAUTHENTICATED',
            [HttpStatus.FORBIDDEN]: 'FORBIDDEN',
            [HttpStatus.NOT_FOUND]: 'NOT_FOUND',
            [HttpStatus.CONFLICT]: 'CONFLICT',
            [HttpStatus.UNPROCESSABLE_ENTITY]: 'UNPROCESSABLE_ENTITY',
            [HttpStatus.INTERNAL_SERVER_ERROR]: 'INTERNAL_SERVER_ERROR',
        };

        return codeMap[statusCode] || 'INTERNAL_SERVER_ERROR';
    }

    private getStatusCode(code: string): number {
        const statusMap: Record<string, number> = {
            BAD_USER_INPUT: HttpStatus.BAD_REQUEST,
            UNAUTHENTICATED: HttpStatus.UNAUTHORIZED,
            FORBIDDEN: HttpStatus.FORBIDDEN,
            NOT_FOUND: HttpStatus.NOT_FOUND,
            CONFLICT: HttpStatus.CONFLICT,
            UNPROCESSABLE_ENTITY: HttpStatus.UNPROCESSABLE_ENTITY,
            INTERNAL_SERVER_ERROR: HttpStatus.INTERNAL_SERVER_ERROR,
        };

        return statusMap[code] || HttpStatus.INTERNAL_SERVER_ERROR;
    }

    private sanitizeDatabaseError(message: string): string {
        // Don't expose sensitive database information in production
        if (process.env.NODE_ENV === 'production') {
            return 'A database error occurred';
        }
        return message;
    }
}
