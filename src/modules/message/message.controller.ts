import { Body, Controller, Delete, Param, ParseUUIDPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { ReplyMessage } from "src/global/types/reply-message.type";
import { AuthGuard } from "../auth/guards/auth.guard";
import { CurrentUser } from "../user/decorators/current-user.decorator";
import { UserDto } from "../user/dtos/user.dto";
import { CreateMessageDto } from "./dtos/create-message.dto";
import { UpdateMessageDto } from "./dtos/update-message.dto";
import { MessageService } from "./message.service";

@Controller("message")
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@CurrentUser() user: UserDto, @Body() body: CreateMessageDto): Promise<ReplyMessage> {
    return await this.messageService.create(user.sub, body);
  }

  @Patch(":id")
  @UseGuards(AuthGuard)
  async update(@CurrentUser() user: UserDto, @Param("id", ParseUUIDPipe) id: string, @Body() body: UpdateMessageDto): Promise<ReplyMessage> {
    return await this.messageService.update(user.sub, id, body);
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  async remove(@CurrentUser() user: UserDto, @Param("id", ParseUUIDPipe) id: string): Promise<ReplyMessage> {
    return await this.messageService.remove(user.sub, id);
  }

  @Patch("read/:id")
  @UseGuards(AuthGuard)
  async markMessageAsRead(@CurrentUser() user: UserDto, @Param("id", ParseUUIDPipe) id: string): Promise<ReplyMessage> {
    return await this.messageService.markMessageAsRead(user.sub, id);
  }
}
