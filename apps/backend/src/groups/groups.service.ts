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
      columns: {
        'column-1': {
          id: 'column-1',
          column_id: 'column-1',
          title: 'Completed',
          taskIds: [],
        },
      },
      columnOrder: ['column-1'],
    };

    groups.forEach((group) => {
      initialData.columns[group.column_id] = {
        id: group.id,
        column_id: group.column_id,
        title: group.title,
        taskIds: group.todos.map((todo) => todo.todo_id),
      };

      group.todos.forEach((todo) => {
        initialData.tasks[todo.todo_id] = todo;
      });

      initialData.columnOrder.push(group.column_id);
    });

    return initialData;
  }

  findOne(id: number) {
    return this.groupRepository.findOne({ where: { id } });
  }

  async update(id: number, updateGroupDto: UpdateGroupDto) {
    const group = await this.groupRepository.findOne({ where: { id } });

    Object.assign(group, updateGroupDto);
    return this.groupRepository.save(group);
  }

  remove(id: number) {
    return this.groupRepository.delete({ id });
  }
}
