import { registerAs } from "@nestjs/config";

export const authConfig = registerAs("authConfig", () => ({
  accessSecret: process.env.JWT_ACCESS_SECRET,
  refreshSecret: process.env.JWT_REFRESH_SECRET,
  expiresIn: Number(process.env.JWT_EXPIRES_IN),
  issuer: process.env.JWT_ISSUER,
  audience: process.env.JWT_AUDIENCE,
}));
