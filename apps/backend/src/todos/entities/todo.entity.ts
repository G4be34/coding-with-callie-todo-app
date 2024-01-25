import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column()
  completed: boolean;

  @Column('text', { array: true })
  labels: string[];

  @Column()
  date: Date;

  @Column()
  group: string;

  @Column()
  priority: 'low' | 'medium' | 'high';
}
