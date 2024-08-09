import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodosService } from './todos.service';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  create(@Body() createTodoDto: CreateTodoDto) {
    return this.todosService.create(createTodoDto);
  }

  @Get()
  findAll() {
    return this.todosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.todosService.findOne(id);
  }

  @Patch('update-positions')
  updatePositions(
    @Body() body: { tasksToUpdate: { todo_id: string; position: number }[] },
  ) {
    return this.todosService.updatePositions(body.tasksToUpdate);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todosService.update(id, updateTodoDto);
  }

  @Patch()
  completeMultipleTodos(
    @Body() body: { ids: string[]; dateCompleted: string },
  ) {
    const { ids, dateCompleted } = body;
    return this.todosService.completeMultiple(ids, dateCompleted);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.todosService.remove(id);
  }

  @Delete()
  removeAll(@Query('ids') ids: string[]) {
    return this.todosService.remove(ids);
  }
}
