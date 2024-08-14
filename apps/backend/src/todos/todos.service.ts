import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupsService } from 'src/groups/groups.service';
import { In, Repository } from 'typeorm';
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
    await this.todoRepository.increment(
      { todo_id: createTodoDto.todo_id },
      'position',
      1,
    );
    const todo = this.todoRepository.create(createTodoDto);
    const group = await this.groupService.findOne(createTodoDto.groupId);
    todo.group = group;
    const newTodo = await this.todoRepository.save(todo);
    return newTodo;
  }

  async findAll(userId) {
    const columns = this.groupService.getTodos(userId);
    return columns;
  }

  findOne(id: number) {
    return this.todoRepository.findOne({ where: { id } });
  }

  async update(id: string, updateTodoDto: UpdateTodoDto) {
    const todo = await this.todoRepository.findOne({ where: { todo_id: id } });

    if (updateTodoDto.groupId) {
      const group = await this.groupService.findOne(updateTodoDto.groupId);
      todo.group = group;

      if (updateTodoDto.date_completed !== undefined) {
        todo.date_completed = updateTodoDto.date_completed;
      }

      if (updateTodoDto.position !== undefined) {
        todo.position = updateTodoDto.position;
      }
    } else {
      Object.assign(todo, updateTodoDto);
    }

    return await this.todoRepository.save(todo);
  }

  async updatePositions(tasks: { todo_id: string; position: number }[]) {
    const todos = await this.todoRepository.find({
      where: { todo_id: In(tasks.map((task) => task.todo_id)) },
    });

    todos.forEach((todo) => {
      todo.position = tasks.find(
        (task) => task.todo_id === todo.todo_id,
      ).position;
    });

    return await this.todoRepository.save(todos);
  }

  async completeMultiple(ids: string[], date_completed: string) {
    const todos = await this.todoRepository.find({
      where: { todo_id: In(ids) },
    });
    const completedGroup = await this.groupService.findOne('column-1');

    todos.forEach((todo) => {
      todo.date_completed = date_completed;
      todo.group = completedGroup;
    });

    return await this.todoRepository.save(todos);
  }

  remove(id: string | string[]) {
    if (Array.isArray(id)) {
      return this.todoRepository.delete({ todo_id: In(id) });
    } else {
      return this.todoRepository.delete({ todo_id: id });
    }
  }
}
