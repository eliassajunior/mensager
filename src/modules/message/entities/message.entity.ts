import { User } from "src/modules/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "messages" })
export class Message {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", nullable: true })
  title?: string;
  @Column({ type: "varchar" })
  content: string;
  @Column({ type: "boolean", default: false })
  read: boolean;

  @ManyToOne(() => User, (user) => user.messagesFrom, { onDelete: "CASCADE" })
  @JoinColumn({ name: "from" })
  from: User;
  @ManyToOne(() => User, (user) => user.messagesTo, { onDelete: "CASCADE" })
  @JoinColumn({ name: "to" })
  to: User;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
