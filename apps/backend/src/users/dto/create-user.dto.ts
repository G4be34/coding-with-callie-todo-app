import { Transform, TransformFnParams } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import * as sanitizeHtml from 'sanitize-html';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
  username: string;

  @IsNotEmpty()
  @IsEmail()
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
  password: string;

  @IsString()
  theme: string;

  @IsString()
  font: string;

  @IsString()
  background: string;
}
