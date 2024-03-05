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

  @Column({ nullable: true })
  date_completed: Date | null;

  @Column()
  due_date: Date;

  @Column()
  date_added: Date;

  @Column()
  priority: 'Normal' | 'High' | 'Highest';

  @ManyToOne(() => Group, (group) => group.todos)
  group: Group;
}
