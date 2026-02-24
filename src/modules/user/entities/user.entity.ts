import { Message } from "src/modules/message/entities/message.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 100 })
  name: string;
  @Column({ type: "varchar", length: 255, unique: true })
  email: string;
  @Column({ type: "varchar" })
  password: string;
  @Column({ type: "varchar", nullable: true })
  refreshToken: string;

  @OneToMany(() => Message, (message) => message.from)
  messagesFrom: Message[];
  @OneToMany(() => Message, (message) => message.to)
  messagesTo: Message[];

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
