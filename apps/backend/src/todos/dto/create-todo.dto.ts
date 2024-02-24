import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  todo_id: string;

  @IsNotEmpty()
  description: string;

  @IsDate()
  date_added: Date;

  @IsDate()
  due_date: Date;

  @IsDate()
  date_completed: Date | null;

  @IsNotEmpty()
  @IsString()
  priority: 'Normal' | 'High' | 'Highest';

  @IsString()
  group: string;
}
