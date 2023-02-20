import { Body, Controller, Header, Put, Req } from '@nestjs/common';
import { StudyService } from './study.service';
import { Request } from 'express';

export class CalcDto {
  one: number;
  two: number;
}

@Controller('study')
export class StudyController {
  constructor(private readonly studyService: StudyService) {}

  @Put()
  @Header('type-operation', 'plus')
  getAll(@Req() request: Request, @Body() dto: CalcDto): number {
    const operationType = request.headers['Type-Operation'];
    const result = this.studyService.put(dto, 'minus');
    return result;
  }
}
