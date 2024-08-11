import {
  Allow,
  IsNotEmpty,
  IsNumber,
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

  @IsNumber()
  position: number;

  @IsNotEmpty()
  @IsString()
  priority: 'Normal' | 'High' | 'Highest';

  @IsString()
  groupId: string;
}
