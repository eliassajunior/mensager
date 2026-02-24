import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "../user/user.module";
import { Message } from "./entities/message.entity";
import { MessageController } from "./message.controller";
import { MessageService } from "./message.service";

@Module({
  imports: [TypeOrmModule.forFeature([Message]), UserModule, JwtModule],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
