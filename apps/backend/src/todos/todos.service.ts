import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupsService } from 'src/groups/groups.service';
import { Repository } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
    private readonly groupService: GroupsService,
  ) {}
  async create(createTodoDto: CreateTodoDto) {
    const todo = this.todoRepository.create(createTodoDto);
    const group = await this.groupService.findOne(createTodoDto.groupId);
    todo.group = group;
    const newTodo = await this.todoRepository.save(todo);
    return newTodo;
  }

  findAll() {
    return this.todoRepository.find();
  }

  findOne(id: number) {
    return this.todoRepository.findOne({ where: { id } });
  }

  async update(id: string, updateTodoDto: UpdateTodoDto) {
    const todo = await this.todoRepository.findOne({ where: { todo_id: id } });

    Object.assign(todo, updateTodoDto);
    return await this.todoRepository.save(todo);
  }

  remove(id: string) {
    return this.todoRepository.delete({ todo_id: id });
  }
}
