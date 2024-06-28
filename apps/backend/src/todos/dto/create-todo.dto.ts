import {
  Allow,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTodoDto {
  @IsString()
  todo_id: string;

  @IsNotEmpty()
  description: string;

  @Allow()
  date_added: string;

  @Allow()
  due_date: string | null;

  @IsString()
  @IsOptional()
  date_completed: string | null;

  @IsNotEmpty()
  @IsString()
  priority: 'Normal' | 'High' | 'Highest';

  @IsInt()
  groupId: number;
}
