import { Group } from 'src/groups/entities/group.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  todo_id: string;

  @Column()
  description: string;

  @Column({ nullable: true, type: 'bigint' })
  date_completed: string | null;

  @Column({ nullable: true, type: 'bigint' })
  due_date: string | null;

  @Column({ type: 'bigint' })
  date_added: string;

  @Column()
  priority: 'Normal' | 'High' | 'Highest';

  @ManyToOne(() => Group, (group) => group.todos)
  group: Group;
}
