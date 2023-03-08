import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Render,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { imageFileFilter } from '../utils/imageFileFilter';
import { HelperFileLoader } from '../utils/helperFileLoader';
import { UsersEntity } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/role/roles.decorator';
import { Role } from '../auth/role/role.enum';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

const PATH_COMMENTS = '/static/';
const helperFileLoaderComment = new HelperFileLoader();
helperFileLoaderComment.path = PATH_COMMENTS;

@ApiTags('users')
@Controller('users')
export class UsersController {
  @ApiOperation({ summary: 'create user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'user created',
    type: UsersEntity,
  })
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

  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'find all users' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'get all users',
    type: [UsersEntity],
  })
  @Get('api')
  findAll() {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'find one user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'get one user',
    type: UsersEntity,
  })
  @Get('api/:id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<UsersEntity> {
    const _user = await this.usersService.findById(id);

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

  @ApiOperation({ summary: 'update news' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'user updated',
    type: UsersEntity,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'forbidden',
  })
  @UseGuards(JwtAuthGuard)
  @Roles(Role.User)
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
    @Req() req,
  ) {
    if (avatar[0]?.filename) {
      updateUserDto.avatar = PATH_COMMENTS + avatar[0].filename;
    }

    return this.usersService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: 'delete user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'user deleted',
    type: UsersEntity,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'forbidden',
  })
  @Delete('api/:id')
  async remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  // VIEW =================================================================

  @Get('update/:id')
  @Render('update-user')
  async updateUserView(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const _user = await this.usersService.findById(+id);
    if (!_user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Такого пользователя не существует',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      _user,
      title: 'Изменение данных пользователя',
    };
  }
}
