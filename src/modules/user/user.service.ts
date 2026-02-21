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
    return await this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: id } });
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

    const newUser = await this.userRepository.create({
      name: data.name,
      email: data.email,
      password: hash,
    });

    await this.userRepository.save(newUser);

    return { message: "Usuário criado com sucesso!" };
  }

  async update(id: string, data: UpdateUserDto): Promise<ReplyMessage> {
    const user = await this.findOne(id);

    const name = data.name ? data.name : user.name;
    const password = data.password ? await bcrypt.hash(data.password, await bcrypt.genSalt()) : user.password;

    await this.userRepository.update(id, {
      name: name,
      password: password,
    });

    return { message: "Usuário atualizado com sucesso!" };
  }

  async remove(id: string): Promise<ReplyMessage> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);

    return { message: "Usuário removido com sucesso!" };
  }
}
