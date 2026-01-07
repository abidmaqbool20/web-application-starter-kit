import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface';
import { AuthRepository } from './auth.repository';
import { TokenService } from './token.service';
import { Request } from 'express';
import { config } from 'dotenv';

config();

// Custom extractor to get JWT from cookie or Authorization header
const cookieOrHeaderExtractor = (req: Request): string | null => {
  // First try to get token from HTTP-only cookie
  if (req.cookies && req.cookies.access_token) {
    return req.cookies.access_token;
  }
  // Fallback to Authorization header
  const authHeader = req.headers?.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  return null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly tokenService: TokenService,
  ) {
    super({
      jwtFromRequest: cookieOrHeaderExtractor,
      ignoreExpiration: false,
      secretOrKey:
        process.env.JWT_SECRET ||
        'aY1le56893WRjtAQyzMemUUq3RfreGYJY1iL',
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: JwtPayload) {
    // Get token from cookie or header
    const token = cookieOrHeaderExtractor(request);

    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }

    const isBlacklisted = await this.tokenService.isTokenBlacklisted(token);

    if (isBlacklisted) {
      throw new UnauthorizedException('Invalid token');
    }

    return payload;
  }
}
