import { Todo } from 'src/todos/entities/todo.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  column_id: number;

  @Column()
  title: string;

  @Column()
  position: number;

  @OneToMany(() => Todo, (todo) => todo.group)
  todos: Todo[];
}
