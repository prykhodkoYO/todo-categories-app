import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @MinLength(1)
  text!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  @MinLength(1)
  category!: string;
}
