import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { hash } from '../utils/crypto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    // const user = await this.usersRepository.create(createUserDto);

    const userEntity = new UsersEntity();
    userEntity.firstName = createUserDto.firstName;
    userEntity.lastName = createUserDto.lastName;
    userEntity.email = createUserDto.email;
    userEntity.roles = createUserDto.roles;
    if (!createUserDto.avatar) {
      userEntity.avatar =
        'https://media.istockphoto.com/id/476085198/photo/businessman-silhouette-as-avatar-or-default-profile-picture.jpg?s=612x612&w=0&k=20&c=GVYAgYvyLb082gop8rg0XC_wNsu0qupfSLtO7q9wu38=';
    }
    userEntity.avatar = createUserDto.avatar;
    userEntity.password = await hash(createUserDto.password);

    return this.usersRepository.save(userEntity);
  }

  async findAll() {
    return this.usersRepository.find();
  }

  async findOne(id: number) {
    return this.usersRepository.findOneBy({
      id,
    });
  }

  async findByEmail(email: string) {
    return this.usersRepository.findOneBy({
      email,
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    let _user = await this.usersRepository.findOneBy({
      id,
    });

    if (!_user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Такого пользователя не существует',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    _user = {
      ..._user,
      ...updateUserDto,
    };

    return this.usersRepository.save(_user);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
