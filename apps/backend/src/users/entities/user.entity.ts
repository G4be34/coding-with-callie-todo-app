import { Group } from 'src/groups/entities/group.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  photo: string;

  @Column()
  theme: string;

  @Column()
  font: string;

  @Column()
  background: string;

  @OneToMany(() => Group, (group) => group.user, { eager: true, cascade: true })
  groups: Group[];
}
