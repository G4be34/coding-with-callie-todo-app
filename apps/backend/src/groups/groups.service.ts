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
    console.log('Made it past the create function');
    const user = await this.usersService.findOne(createGroupDto.userId);
    console.log('Made it past the findOne function');
    group.user = user;
    console.log('User value: ', user);
    return this.groupRepository.save(group);
  }

  async findAll(userId) {
    const groups = await this.groupRepository.find({
      where: { user: { id: userId } },
      order: { position: 'ASC' },
    });

    const initialData = {
      tasks: {},
      columns: { 2000: { id: 2000, title: 'Completed', taskIds: [] } },
      columnOrder: [2000],
    };

    groups.forEach((group) => {
      initialData.columns[group.id] = {
        id: group.id,
        title: group.title,
        taskIds: group.todos.map((todo) => todo.id),
      };

      initialData.columnOrder.push(group.id);
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
