import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { HttpExceptionFilter } from './config/http-exception.filter';
import { CustomLoggerService } from './modules/global/logger/logger.service';
import { config as loadDotEnv } from 'dotenv';
import cookieParser from 'cookie-parser';

/**
 * Load base .env
 */
loadDotEnv();

/**
 * Load environment-specific .env file
 */
function loadEnv(): void {
  const env = process.env.NODE_ENV || 'development';
  loadDotEnv({ path: `.env.${env}` });
}

async function bootstrap(): Promise<void> {
  loadEnv();

  const app = await NestFactory.create(AppModule);

  /**
   * Cookie parser middleware for HTTP-only cookie auth
   */
  app.use(cookieParser());

  /**
   * Enable CORS for frontend integration
   * Allows Next.js dev server (3001, 3000) to proxy requests
   */
  app.enableCors({
    origin: ['http://localhost:3001', 'http://localhost:3000', 'http://localhost:5001'],
    credentials: true,
  });

  /**
   * Global exception handling
   */
  app.useGlobalFilters(
    new HttpExceptionFilter(new CustomLoggerService()),
  );

  /**
   * Global validation
   */
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  /**
   * Start server
   */
  const port = process.env.PORT || 5001;
  await app.listen(port, '0.0.0.0');

  new Logger('Bootstrap').log(
    `🚀 Application running on http://localhost:${port}`,
  );
  new Logger('Bootstrap').log(
    `📊 GraphQL Playground available at http://localhost:${port}/graphql`,
  );
}

bootstrap();
