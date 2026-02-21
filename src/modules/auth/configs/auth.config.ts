import { registerAs } from "@nestjs/config";

export const authConfig = registerAs("authConfig", () => ({
  secret: process.env.JWT_SECRET,
  refreshToken: process.env.JWT_REFRESH_TOKEN,
  expiresIn: Number(process.env.JWT_EXPIRES_IN),
  issuer: process.env.JWT_ISSUER,
  audience: process.env.JWT_AUDIENCE,
}));
