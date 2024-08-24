import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Group } from './entities/group.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    private readonly usersService: UsersService,
  ) {}

  async create(createGroupDto: CreateGroupDto) {
    const group = await this.groupRepository.create(createGroupDto);
    const user = await this.usersService.findOne(createGroupDto.userId);
    group.user = user;
    return this.groupRepository.save(group);
  }

  async findAll(userId) {
    const groups = await this.groupRepository.find({
      where: { user: { id: userId } },
      order: { position: 'ASC' },
      relations: { todos: true },
    });

    const initialData = {
      tasks: {},
      columns: {},
      columnOrder: [],
    };

    groups.forEach((group) => {
      group.todos.sort((a, b) => a.position - b.position);

      initialData.columns[group.column_id] = {
        id: group.id,
        column_id: group.column_id,
        title: group.title,
        taskIds: group.todos.map((todo) => todo.todo_id),
      };

      group.todos.forEach((todo) => {
        initialData.tasks[todo.todo_id] = {
          ...todo,
          groupId: group.column_id,
        };
      });

      initialData.columnOrder.push(group.column_id);
    });

    return initialData;
  }

  findOne(id: string) {
    return this.groupRepository.findOne({ where: { column_id: id } });
  }

  async update(id: number, updateGroupDto: UpdateGroupDto) {
    const group = await this.groupRepository.findOne({ where: { id } });

    Object.assign(group, updateGroupDto);
    return this.groupRepository.save(group);
  }

  remove(id: string) {
    return this.groupRepository.delete({ column_id: id });
  }

  async getTodos(userId: number) {
    let todos = [];
    const groups = await this.groupRepository.find({
      where: { user: { id: userId } },
      relations: { todos: true },
    });

    groups.forEach((group) => {
      todos = [...todos, ...group.todos];
    });

    return todos;
  }
}
