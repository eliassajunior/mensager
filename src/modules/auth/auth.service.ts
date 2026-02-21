import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import type { ConfigType } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { Repository } from "typeorm";
import { User } from "../user/entities/user.entity";
import { authConfig } from "./configs/auth.config";
import { LoginDto } from "./dtos/login.dto";
import { Tokens } from "./types/tokens.type";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    @Inject(authConfig.KEY)
    private readonly config: ConfigType<typeof authConfig>,
  ) {}

  async login(data: LoginDto): Promise<Tokens> {
    const user = await this.userRepository.findOneBy({ email: data.email });

    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      throw new UnauthorizedException("E-mail ou senha inválidas.");
    }
    return await this.generateToken(user.id);
  }

  private async generateToken(id: string): Promise<Tokens> {
    const payload = { sub: id };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.config.secret,
      expiresIn: "15min",
      issuer: this.config.issuer,
      audience: this.config.audience,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.config.secret,
      expiresIn: this.config.expiresIn,
      issuer: this.config.issuer,
      audience: this.config.audience,
    });

    return { accessToken, refreshToken };
  }

  async regenerateToken(refreshToken: string) {}
}
