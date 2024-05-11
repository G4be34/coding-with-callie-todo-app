import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

type UserWithInitialData = {
  user: User;
  initialData: {
    tasks: object;
    columns: object;
    columnOrder: any[];
  };
};

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create(createUserDto);

    return await this.userRepository.save(user);
  }

  async findEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      return false;
    }

    return {
      id: user.id,
      username: user.username,
    };
  }

  async findOne(id: number): Promise<any> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.groups.sort((a, b) => a.position - b.position);

    // const initialData = {
    //   tasks: {},
    //   columns: {},
    //   columnOrder: [],
    // };

    // user.groups.forEach((group) => {
    //   initialData.columns[group.id] = {
    //     id: group.id,
    //     title: group.title,
    //     taskIds: group.todos.map((todo) => todo.id),
    //   };

    //   initialData.columnOrder.push(group.id);
    // });

    return user;
  }

  validateUser(email: string) {
    const user = this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    const { password } = updateUserDto;

    if (password) {
      updateUserDto.password = await bcrypt.hash(password, 10);
    }

    Object.assign(user, updateUserDto);
    await this.userRepository.save(user);
    return user;
  }

  remove(id: number) {
    return this.userRepository.delete({ id });
  }

  async verifyPassword(id: number, password: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (await bcrypt.compare(password, user.password)) {
      return true;
    }

    return false;
  }
}
