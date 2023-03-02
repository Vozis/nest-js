import { HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';

export const imageFileFilter = (req: Request, file: any, callback: any) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(
      new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Для изображение поддерживаются форматы png, jpeg, jpg и gif',
        },
        HttpStatus.BAD_REQUEST,
      ),
      false,
    );
  }
  return callback(null, true);
};
