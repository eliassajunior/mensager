import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateMessageDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  to: string;
}
