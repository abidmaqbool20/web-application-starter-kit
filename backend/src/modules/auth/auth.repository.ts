import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './jwt-payload.interface';
import { GeneralHelper } from '../global/helper/general.helper.service';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register.dto';
import { CustomLoggerService } from '../global/logger/logger.service';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TokenService } from './token.service';
import * as bcrypt from 'bcryptjs';
import { config } from 'dotenv';
config();

@Injectable()
export class AuthRepository {


  constructor(
    private readonly helper: GeneralHelper,
    private readonly tokenService: TokenService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly logger: CustomLoggerService,
    @InjectRepository(User)
    private readonly UserDBRepository: Repository<User>,
  ) { }


  async validateUser(username: string, password: string, userType: string): Promise<any> {
    // Use raw query to get password and user_type (to avoid any ORM transformations)
    const rawResult = await this.UserDBRepository.query(
      'SELECT id, email, password, user_type FROM users WHERE email = $1',
      [username]
    );

    if (!rawResult || rawResult.length === 0 || !rawResult[0].password) {
      return null;
    }

    const userPassword = rawResult[0].password;
    const dbUserType = rawResult[0].user_type;

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, userPassword);

    if (!isPasswordValid) {
      return null;
    }

    // Verify user_type matches
    if (dbUserType !== userType) {
      return null;
    }

    // Now get full user with relations
    const user = await this.UserDBRepository.findOne({
      where: { email: username },
      relations: ['roles', 'roles.permissions'],
    });

    return user;
  }

  async login(data: LoginDto) {
    const user = await this.validateUser(data.username, data.password, data.user_type);

    // Return null instead of throwing - let service layer handle HTTP exceptions
    if (!user) {
      return null;
    }

    // Minimal JWT payload - only include essential identity info
    // Permissions will be fetched via the 'me' query after authentication
    const payload: JwtPayload = {
      username: user.email,
      sub: user.id.toString(),
      roles: [], // Empty array to maintain interface compatibility
    };

    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: process.env.JWT_TOKEN_EXPIRE_TIME || '1h',
      }),
    };
  }

  async register(data: RegisterUserDto) {
    const hashedPassword = await GeneralHelper.encrypt(data.password, 'bcrypt');

    const newUser = this.UserDBRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      created_at: new Date(),
      updated_at: new Date(),
    });

    await this.UserDBRepository.save(newUser);
    await this.helper.delCache([`users-findAll`]);
    return newUser;
  }

  async logout(token: string): Promise<boolean> {
    this.tokenService.addTokenToBlacklist(token);
    return true;
  }
}
