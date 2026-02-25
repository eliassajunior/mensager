import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ReplyMessage } from "src/global/types/reply-message.type";
import { Repository } from "typeorm";
import { UserService } from "../user/user.service";
import { CreateMessageDto } from "./dtos/create-message.dto";
import { UpdateMessageDto } from "./dtos/update-message.dto";
import { Message } from "./entities/message.entity";

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly userService: UserService,
  ) {}

  async create(userId: string, data: CreateMessageDto): Promise<ReplyMessage> {
    const from = await this.userService.findOne(userId);
    const to = await this.userService.findOne(data.to);

    const newUser = this.messageRepository.create({
      title: data.title,
      content: data.content,
      from: from,
      to: to,
    });
    await this.messageRepository.save(newUser);

    return { message: `Mensagem enviada para ${to.email}.` };
  }

  async update(userId: string, id: string, data: UpdateMessageDto): Promise<ReplyMessage> {
    const message = await this.messageRepository.findOne({
      where: {
        id: id,
        from: { id: userId },
      },
    });
    if (!message) {
      throw new NotFoundException("Mensagem não encontrada.");
    }

    if (message.read) {
      return { message: "Mensagem já foi lida, não é possível atualizar a mensagem." };
    }

    const title = data.title ? data.title : message.title;
    const content = data.content ? data.content : message.content;

    await this.messageRepository.update(id, {
      title: title,
      content: content,
    });

    return { message: "Mensagem atualizada com sucesso!" };
  }

  async remove(userId: string, id: string): Promise<ReplyMessage> {
    const message = await this.messageRepository.findOne({
      where: {
        id: id,
        from: { id: userId },
      },
    });
    if (!message) {
      throw new NotFoundException("Mensagem não encontrada.");
    }

    if (message.read) {
      return { message: "Mensagem já foi lida, não é possível remover a mensagem." };
    }

    await this.messageRepository.remove(message);

    return { message: "Mensagem removida com sucesso!" };
  }

  async markMessageAsRead(userId: string, id: string): Promise<ReplyMessage> {
    const message = await this.messageRepository.findOne({
      where: {
        id: id,
        to: { id: userId },
      },
      relations: { to: true },
    });
    if (!message) {
      throw new NotFoundException("Mensagem não encontrada.");
    }

    await this.messageRepository.update(id, {
      read: true,
    });

    return { message: "Mensagem atualizada com sucesso!" };
  }
}
