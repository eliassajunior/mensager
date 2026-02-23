import { CanActivate, ExecutionContext, Inject, UnauthorizedException } from "@nestjs/common";
import type { ConfigType } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { authConfig } from "../configs/auth.config";
import { USER_PAYLOAD } from "../consts/payload";

export class AuthGuard implements CanActivate {
  constructor(
    @Inject(authConfig.KEY)
    private readonly config: ConfigType<typeof authConfig>,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const authorization = request.headers.authorization;
    if (!authorization) {
      throw new UnauthorizedException("Token não fornecido.");
    }

    const [bearer, token] = authorization.split(" ");
    if (bearer !== "Bearer" || !token) {
      throw new UnauthorizedException("Token inválido.");
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.config.accessSecret,
        issuer: this.config.issuer,
        audience: this.config.audience,
      });
      request[USER_PAYLOAD] = payload;

      return true;
    } catch {
      throw new UnauthorizedException("Token expirado ou inválido.");
    }
  }
}
