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

  findAll(userId) {
    return this.groupRepository.find({ where: { user: { id: userId } } });
  }

  findOne(id: number) {
    return this.groupRepository.findOne({ where: { id } });
  }

  update(id: number, updateGroupDto: UpdateGroupDto) {
    return `This action updates a #${id} group`;
  }

  remove(id: number) {
    return `This action removes a #${id} group`;
  }
}
