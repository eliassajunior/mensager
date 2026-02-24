import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { ReplyMessage } from "src/global/types/reply-message.type";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { User } from "./entities/user.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      relations: { messagesFrom: { to: true }, messagesTo: { from: true } },
      select: {
        id: true,
        name: true,
        email: true,

        messagesFrom: {
          id: true,
          title: true,
          content: true,
          read: true,
          to: {
            id: true,
            email: true,
          },
        },

        messagesTo: {
          id: true,
          title: true,
          content: true,
          read: true,
          from: {
            id: true,
            email: true,
          },
        },
      },
    });
  }

  async findOne(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: { messagesFrom: { to: true }, messagesTo: { from: true } },
      select: {
        id: true,
        name: true,
        email: true,

        messagesFrom: {
          id: true,
          title: true,
          content: true,
          read: true,
          to: {
            id: true,
            email: true,
          },
        },

        messagesTo: {
          id: true,
          title: true,
          content: true,
          read: true,
          from: {
            id: true,
            email: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException("Usuário não encontrado.");
    }
    return user;
  }

  async create(data: CreateUserDto): Promise<ReplyMessage> {
    const user = await this.userRepository.findOneBy({ email: data.email });
    if (user) {
      throw new ForbiddenException("O e-mail já está em uso.");
    }

    const hash = await bcrypt.hash(data.password, await bcrypt.genSalt());

    const newUser = this.userRepository.create({
      name: data.name,
      email: data.email,
      password: hash,
    });

    await this.userRepository.save(newUser);

    return { message: "Usuário criado com sucesso!" };
  }

  async update(userId: string, data: UpdateUserDto): Promise<ReplyMessage> {
    const user = await this.findOne(userId);

    const name = data.name ? data.name : user.name;
    const password = data.password ? await bcrypt.hash(data.password, await bcrypt.genSalt()) : user.password;

    await this.userRepository.update(userId, {
      name: name,
      password: password,
    });

    return { message: "Usuário atualizado com sucesso!" };
  }

  async remove(userId: string): Promise<ReplyMessage> {
    const user = await this.findOne(userId);
    await this.userRepository.remove(user);

    return { message: "Usuário removido com sucesso!" };
  }
}
