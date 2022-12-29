import { UsersService } from './../users/users.service';
import { NestMiddleware, Injectable } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtService } from './jwt.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    if ('x-jwt' in req.headers) {
      const token = req.headers['x-jwt'];
      const decodedToken = this.jwtService.verify(token.toString());
      if (
        typeof decodedToken === 'object' &&
        decodedToken.hasOwnProperty('id')
      ) {
        try {
          const user = await this.userService.findUserById(decodedToken['id']);
          req['user'] = user;
        } catch (e) {
          console.log(e);
        }
      }
    }
    next();
  }
}
