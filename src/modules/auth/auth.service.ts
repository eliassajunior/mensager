import { ForbiddenException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import type { ConfigType } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../user/entities/user.entity";
import { authConfig } from "./configs/auth.config";
import { LoginDto } from "./dtos/login.dto";
import { HashService } from "./hash/hash.service";
import { Tokens } from "./types/tokens.type";
import { UserPayload } from "./types/user.type";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(authConfig.KEY)
    private readonly config: ConfigType<typeof authConfig>,
    private readonly jwtService: JwtService,
    private readonly hashService: HashService,
  ) {}

  async login(data: LoginDto): Promise<Tokens> {
    const user = await this.userRepository.findOneBy({ email: data.email });

    if (!user || !(await this.hashService.compare(data.password, user.password))) {
      throw new UnauthorizedException("E-mail ou senha inválidas.");
    }

    const tokens = await this.generateTokens(user.id);
    await this.userRepository.update(user.id, {
      refreshToken: await this.hashService.hash(tokens.refreshToken),
    });

    return tokens;
  }

  async refresh(refreshToken: string) {
    const payload: UserPayload = await this.verifyToken(refreshToken);

    const user = await this.userRepository.findOne({ where: { id: payload.sub } });
    if (!user || !user.refreshToken) {
      throw new ForbiddenException("Usuário ou token não existem.");
    }

    if (!(await this.hashService.compare(refreshToken, user.refreshToken))) {
      throw new ForbiddenException("Tokens não coincidem.");
    }

    const tokens = await this.generateTokens(user.id);
    await this.userRepository.update(user.id, {
      refreshToken: await this.hashService.hash(tokens.refreshToken),
    });

    return tokens;
  }

  private async generateTokens(id: string): Promise<Tokens> {
    const payload = { sub: id };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.config.accessSecret,
      expiresIn: "15m",
      issuer: this.config.issuer,
      audience: this.config.audience,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.config.refreshSecret,
      expiresIn: this.config.expiresIn,
      issuer: this.config.issuer,
      audience: this.config.audience,
    });

    return { accessToken, refreshToken };
  }

  private async verifyToken(refreshToken: string) {
    try {
      return await this.jwtService.verifyAsync(refreshToken, {
        secret: this.config.refreshSecret,
        audience: this.config.audience,
        issuer: this.config.issuer,
      });
    } catch {
      throw new UnauthorizedException("Token inválido.");
    }
  }
}
