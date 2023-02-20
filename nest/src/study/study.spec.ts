import { Test, TestingModule } from '@nestjs/testing';
import { StudyService } from './study.service';

describe('Study', () => {
  let provider: StudyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudyService],
    }).compile();

    provider = module.get<StudyService>(StudyService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
