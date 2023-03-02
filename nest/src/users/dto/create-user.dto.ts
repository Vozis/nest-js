import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Role } from '../../auth/role/role.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  roles: Role;

  @IsString()
  @IsOptional()
  avatar: string;
}
