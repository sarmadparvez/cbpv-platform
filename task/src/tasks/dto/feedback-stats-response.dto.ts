import { QuestionType } from '../entities/question.entity';

export class FeedbackStatsResponseDto {
  stats: QuestionAnswerStats[];
}

export class QuestionAnswerStats {
  questionId: string;
  questionType: QuestionType;
  starRatingAnswer: number;
  starRatingAnswerCount: number;
  radioAnswer: string;
  radioAnswerCount: number;
  thumbsUpCount: number;
  thumbsDownCount: number;
}
