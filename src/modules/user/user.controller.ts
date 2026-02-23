import { Body, Controller, Delete, Get, Patch, Post, UseGuards } from "@nestjs/common";
import { ReplyMessage } from "src/global/types/reply-message.type";
import { AuthGuard } from "../auth/guards/auth.guard";
import { CurrentUser } from "./decorators/current-user.decorator";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { UserDto } from "./dtos/user.dto";
import { User } from "./entities/user.entity";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard)
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Get("me")
  @UseGuards(AuthGuard)
  async findOne(@CurrentUser() user: UserDto): Promise<User> {
    return await this.userService.findOne(user.sub);
  }

  @Post()
  async create(@Body() body: CreateUserDto): Promise<ReplyMessage> {
    return await this.userService.create(body);
  }

  @Patch("me")
  @UseGuards(AuthGuard)
  async update(@CurrentUser() user: UserDto, @Body() body: UpdateUserDto): Promise<ReplyMessage> {
    return await this.userService.update(user.sub, body);
  }

  @Delete("me")
  @UseGuards(AuthGuard)
  async remove(@CurrentUser() user: UserDto): Promise<ReplyMessage> {
    return await this.userService.remove(user.sub);
  }
}
