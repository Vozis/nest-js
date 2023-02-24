import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  ParseIntPipe,
  HttpException,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { imageFileFilter } from '../utils/imageFileFilter';
import { HelperFileLoader } from '../utils/helperFileLoader';
import { UsersEntity } from './entities/user.entity';

const PATH_COMMENTS = '/static/';
const helperFileLoaderComment = new HelperFileLoader();
helperFileLoaderComment.path = PATH_COMMENTS;

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('api')
  @UseInterceptors(
    FilesInterceptor('avatar', 1, {
      storage: diskStorage({
        destination: helperFileLoaderComment.destinationPath,
        filename: helperFileLoaderComment.customFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFiles() avatar: Express.Multer.File,
  ) {
    if (avatar[0]?.filename) {
      createUserDto.avatar = PATH_COMMENTS + avatar[0].filename;
    }

    return this.usersService.create(createUserDto);
  }

  @Get('api')
  findAll() {
    return this.usersService.findAll();
  }

  @Get('api/:id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<UsersEntity> {
    const _user = await this.usersService.findOne(id);

    if (!_user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Пользователь не найден',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return _user;
  }

  @Put('api/:id')
  @UseInterceptors(
    FilesInterceptor('avatar', 1, {
      storage: diskStorage({
        destination: helperFileLoaderComment.destinationPath,
        filename: helperFileLoaderComment.customFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFiles() avatar: Express.Multer.File,
  ) {
    if (avatar[0]?.filename) {
      updateUserDto.avatar = PATH_COMMENTS + avatar[0].filename;
    }

    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
