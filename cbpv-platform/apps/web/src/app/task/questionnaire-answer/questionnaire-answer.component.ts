import { Component, Inject, Input, NgModule, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  Answer,
  CreateFeedbackDto,
  Feedback,
  FeedbacksService,
  Question,
  Task,
} from '../../../gen/api/task';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FlexModule } from '@angular/flex-layout';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { NgxMaterialRatingModule } from 'ngx-material-rating';
import { MatIconModule } from '@angular/material/icon';
import ThumbsRatingAnswerEnum = Answer.ThumbsRatingAnswerEnum;
import { MatButtonModule } from '@angular/material/button';
import { firstValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-questionnaire-answer',
  templateUrl: './questionnaire-answer.component.html',
  styleUrls: ['./questionnaire-answer.component.scss'],
})
export class QuestionnaireAnswerComponent implements OnInit {
  ThumbsRatingEnum = ThumbsRatingAnswerEnum;
  @Input() task!: Task;
  @Input() feedback!: Feedback;
  @Input() readonly!: boolean;
  form!: FormGroup;
  QuestionType = Question.TypeEnum;
  starRatingAnswers: { [key: string]: number } = {};
  thumbsRatingAnswers: { [key: string]: ThumbsRatingAnswerEnum } = {};
  submitted = false;
  processingRequest = false;

  constructor(
    private readonly feedbackService: FeedbacksService,
    private readonly translateService: TranslateService,
    private readonly snackbar: MatSnackBar,
    private readonly router: Router,
  ) {
  }

  ngOnInit(): void {
    this.form = this.questionsToForm(this.task?.questions);
    this.addCommentControl();
    if (this.readonly) {
      this.form.disable();
    }
  }

  questionsToForm(questions: Question[]) {
    if (!questions) {
      throw new Error('No questions are provided');
    }
    const controlsMap: {[key: string]: FormControl} = { };

    questions.forEach(q => {
      let answer: Answer | undefined;
      if (this.feedback && this.feedback.answers) {
        answer = this.feedback.answers.find(a => a.questionId === q.id);
      }
      if (this.isAnswerInForm(q)) {
        let value = '';
        if (answer) {
          value = this.getAnswer(q, answer);
        }
        controlsMap[q.id] = new FormControl(value, Validators.required);
      } else if (answer) {
        this.populateNonFormAnswer(q, answer);
      }
    });
    return new FormGroup(controlsMap);
  }

  getAnswer(question: Question, answer: Answer) {
    if (question.type === this.QuestionType.Text) {
      return answer.textAnswer;
    } else if (question.type === this.QuestionType.Radio) {
      return answer.radioAnswer;
    }
    return '';
  }

  populateNonFormAnswer(question: Question, answer: Answer) {
    if (question.type === this.QuestionType.StarRating) {
      this.starRatingAnswers[question.id] = answer.starRatingAnswer;
    } else if (question.type === this.QuestionType.ThumbsRating) {
      this.thumbsRatingAnswers[question.id] = answer.thumbsRatingAnswer;
    }
  }

  addCommentControl() {
    if (this.form) {
      this.form.addControl(
        'comment',
        new FormControl(this.feedback?.comment || null),
      );
    }
  }

  thumbsUp(questionId: string) {
    this.thumbsRatingAnswers[questionId] = ThumbsRatingAnswerEnum.Up;
  }
  thumbsDown(questionId: string) {
    this.thumbsRatingAnswers[questionId] = ThumbsRatingAnswerEnum.Down;
  }

  async saveAnswers() {
    if (this.processingRequest) {
      return;
    }
    this.submitted = true;
    let valid = true;
    this.task.questions.forEach(q => {
      if (
        !this.isAnswerInForm(q) &&
        !this.starRatingAnswers[q.id] &&
        !this.thumbsRatingAnswers[q.id]
      ) {
        valid = false;
      }
    });
    if (!valid || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    // prepare request for submitting
    const request = <CreateFeedbackDto>{
      comment: this.form.controls["comment"].value,
      taskId: this.task.id,
      answers: [],
    };
    // collect answers
    this.task.questions.forEach(q => {
      const answer = <Answer>{
        questionId: q.id,
      };
      switch (q.type) {
        case this.QuestionType.Text:
          answer.textAnswer = this.form.controls[q.id]?.value;
          break;
        case this.QuestionType.Radio:
          answer.radioAnswer = this.form.controls[q.id]?.value;
          break;
        case this.QuestionType.StarRating:
          answer.starRatingAnswer = this.starRatingAnswers[q.id];
          break;
        case this.QuestionType.ThumbsRating:
          answer.thumbsRatingAnswer = this.thumbsRatingAnswers[q.id];
          break;
      }
      request.answers.push(answer);
    });
    let message = 'notification.submitFeedback';
    try {
      this.processingRequest = true;
      await firstValueFrom(this.feedbackService.create(request));
      this.router.navigate(['tasks']);
    } catch (err) {
      message = 'error.submitFeedback';
      console.log('failed creating feedback ', err);
    } finally {
      this.snackbar.open(this.translateService.instant(message), '', {
        duration: 5000,
      });
      this.processingRequest = false;
    }
  }

  isAnswerInForm(question: Question) {
    return (
      question.type !== this.QuestionType.StarRating &&
      question.type !== this.QuestionType.ThumbsRating
    );
  }
}
@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    TranslateModule,
    ReactiveFormsModule,
    FlexModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    NgxMaterialRatingModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
  ],
  declarations: [QuestionnaireAnswerComponent],
  exports: [QuestionnaireAnswerComponent],
})
export class QuestionnaireAnswerModule {}
