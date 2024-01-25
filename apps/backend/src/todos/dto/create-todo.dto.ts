import { IsArray, IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateTodoDto {
  @IsNotEmpty()
  description: string;

  @IsString()
  date: string;

  @IsNotEmpty()
  priority: 'low' | 'medium' | 'high';

  @IsString()
  group: string;

  @IsBoolean()
  completed: boolean;

  @IsString({ each: true })
  @IsArray()
  labels: string[];
}
