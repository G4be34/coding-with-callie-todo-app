import { Todo } from 'src/todos/entities/todo.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  column_id: string;

  @Column()
  title: string;

  @Column()
  position: number;

  @OneToMany(() => Todo, (todo) => todo.group, { eager: true })
  todos: Todo[];

  @ManyToOne(() => User, (user) => user.groups)
  user: User;
}
