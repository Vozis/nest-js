import { Injectable } from '@nestjs/common';
import { CalcDto } from './study.controller';

@Injectable()
export class StudyService {
  put(dto: CalcDto, symbol: string): number {
    const { one, two } = dto;
    switch (symbol) {
      case 'plus':
        const result = one + two;
        return result;
      case 'minus':
        return one - two;
      case 'multi':
        return one * two;
    }
  }
}
