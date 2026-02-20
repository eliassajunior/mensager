import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from "@nestjs/common";
import { ReplyMessage } from "src/global/types/reply-message.type";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id", ParseUUIDPipe) id: string): Promise<User> {
    return await this.userService.findOne(id);
  }

  @Post()
  async create(@Body() body: CreateUserDto): Promise<ReplyMessage> {
    return await this.userService.create(body);
  }

  @Patch(":id")
  async update(@Param("id", ParseUUIDPipe) id: string, @Body() body: UpdateUserDto): Promise<ReplyMessage> {
    return await this.userService.update(id, body);
  }

  @Delete(":id")
  async remove(@Param("id", ParseUUIDPipe) id: string): Promise<ReplyMessage> {
    return await this.userService.remove(id);
  }
}
