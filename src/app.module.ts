import { Module } from "@nestjs/common";
import { ConfigModule, ConfigType } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as Joi from "joi";
import { globalConfig } from "./global/configs/global.config";
import { globalSchema } from "./global/configs/schemas/global.schema";
import { AuthModule } from "./modules/auth/auth.module";
import { authConfig } from "./modules/auth/configs/auth.config";
import { authSchema } from "./modules/auth/configs/schemas/auth.schema";
import { UserModule } from "./modules/user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [globalConfig, authConfig],
      validationSchema: Joi.object({
        ...globalSchema,
        ...authSchema,
      }),
    }),
    TypeOrmModule.forRootAsync({
      inject: [globalConfig.KEY],
      useFactory: async (config: ConfigType<typeof globalConfig>) => {
        return {
          type: "postgres",
          host: config.host,
          port: config.port,
          username: config.username,
          password: config.password,
          database: config.database,
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
