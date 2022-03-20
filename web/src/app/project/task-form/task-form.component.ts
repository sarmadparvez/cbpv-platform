import {
  Component,
  ElementRef,
  Inject,
  NgModule,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatInputModule } from '@angular/material/input';
import {
  CreateTaskDto,
  Task,
  TasksService,
  UpdateTaskDto,
} from '../../../../gen/api/task';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FlexLayoutModule } from '@angular/flex-layout';
import TestTypeEnum = CreateTaskDto.TestTypeEnum;
import PrototypeFormatEnum = CreateTaskDto.PrototypeFormatEnum;
import { TaskFormatSelectorCardModule } from '../task-format-selector-card/task-format-selector-card.component';
import {
  CountriesService,
  Country,
  Skill,
  SkillsService,
} from '../../../../gen/api/admin';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { firstValueFrom, map, Observable, startWith } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { parseError } from '../../error/parse-error';
import { MatRadioModule } from '@angular/material/radio';

export interface TaskFormDialogData {
  task?: Task;
  projectId: string;
}
@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
})
export class TaskFormComponent implements OnInit {
  PrototypeFormatEnum = PrototypeFormatEnum;
  AccessType = Task.AccessTypeEnum;
  prototypeToTestTypeMap = new Map<PrototypeFormatEnum, TestTypeEnum>();
  task: Task;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  allCountries: Country[] = [];
  allSkills: Skill[] = [];
  selectedSkills: Skill[] = [];
  selectedCountries: Country[] = [];
  filteredSkills: Observable<Skill[]>;
  filteredCountries: Observable<Country[]>;

  form = this.fb.group({
    title: ['', Validators.required],
    description: [null],
    testType: ['', Validators.required],
    prototypeFormat: ['', Validators.required],
    budget: [null, Validators.required],
    incentive: [null, Validators.required],
    minExperience: [null],
    maxExperience: [null],
    minAge: [null],
    maxAge: [null],
    countries: [''],
    skills: ['', [() => this.skillsValid()]],
    accessType: [null, Validators.required],
  });

  @ViewChild('skillsInput') skillsInput: ElementRef<HTMLInputElement>;
  @ViewChild('countriesInput') countriesInput: ElementRef<HTMLInputElement>;

  constructor(
    private readonly fb: FormBuilder,
    private readonly taskService: TasksService,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialogRef<TaskFormComponent>,
    private readonly translateService: TranslateService,
    private readonly skillService: SkillsService,
    private readonly countryService: CountriesService,
    @Inject(MAT_DIALOG_DATA) private readonly data: TaskFormDialogData,
  ) {
    if (this.data.task) {
      this.task = this.data.task;
      this.form.patchValue(this.task);
      this.selectedSkills = this.task.skills.slice();
      this.selectedCountries = this.task.countries.slice();
      this.prototypeToTestTypeMap.set(
        this.task.prototypeFormat,
        this.task.testType,
      );
    }
  }

  async ngOnInit() {
    // fetch skills and countries
    await Promise.all([this.fetchCountries(), this.fetchSkills()]);
    this.filteredCountries = this.form.controls.countries.valueChanges.pipe(
      startWith(null),
      map((value: string | null) =>
        value ? this.filterCountries(value) : this.filterCountries(''),
      ),
    );
    this.filteredSkills = this.form.controls.skills.valueChanges.pipe(
      startWith(null),
      map((value: string | null) =>
        value ? this.filterSkills(value) : this.filterSkills(''),
      ),
    );
  }

  async saveTask() {
    const prototypeFormat = this.form.controls.prototypeFormat.value;
    if (prototypeFormat && this.prototypeToTestTypeMap.has(prototypeFormat)) {
      this.form.controls.testType.setValue(
        this.prototypeToTestTypeMap.get(prototypeFormat),
      );
    } else {
      this.form.controls.testType.setValue('');
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.form.controls.countries.setValue(
      this.selectedCountries.map(country => country.id),
    );
    this.form.controls.skills.setValue(
      this.selectedSkills.map(skill => skill.id),
    );
    let successMsg = '';

    try {
      if (!this.task) {
        const request = <CreateTaskDto>{
          ...this.form.value,
        };
        request.projectId = this.data.projectId;
        await firstValueFrom(this.taskService.create(request));
        successMsg = 'notification.create';
      } else {
        const request = <UpdateTaskDto>{
          ...this.form.value,
        };
        await firstValueFrom(this.taskService.update(this.task.id, request));
        successMsg = 'notification.update';
      }
      // success message
      this.snackBar.open(this.translateService.instant(successMsg), '', {
        duration: 5000,
      });
      this.dialog.close(true);
    } catch (err) {
      console.log('unable to create/update Task ', err);
      const error = parseError(err);
      if (error?.message) {
        this.snackBar.open(error.message, '', {
          duration: 5000,
        });
      }
    }
  }

  setPrototypeFormat(prototypeFormat: PrototypeFormatEnum) {
    this.form.controls.prototypeFormat.setValue(prototypeFormat);
  }

  setTestType(value: TestTypeEnum, prototypeFormat: PrototypeFormatEnum) {
    this.prototypeToTestTypeMap.set(prototypeFormat, value);
  }

  async fetchSkills() {
    try {
      this.allSkills = await firstValueFrom(this.skillService.findAll());
    } catch (err) {
      console.log('unable to fetch skills ', err);
    }
  }

  async fetchCountries() {
    try {
      this.allCountries = await firstValueFrom(this.countryService.findAll());
    } catch (err) {
      console.log('unable to fetch countries ', err);
    }
  }

  private filterSkills(value: string): Skill[] {
    if (typeof value !== 'string') {
      return;
    }
    const filterValue = value.toLowerCase();
    const skillSelected = (skill: Skill) => {
      return (
        this.selectedSkills.findIndex(
          selectedSkill => selectedSkill.id === skill.id,
        ) > -1
      );
    };
    return this.allSkills
      .filter(skill => !skillSelected(skill))
      .filter(option => option.name.toLowerCase().includes(filterValue));
  }

  private filterCountries(value: string): Country[] {
    if (typeof value !== 'string') {
      return;
    }
    const filterValue = value.toLowerCase();
    const countrySelected = (country: Country) => {
      return (
        this.selectedCountries.findIndex(
          selectedCountry => selectedCountry.id === country.id,
        ) > -1
      );
    };
    return this.allCountries
      .filter(country => !countrySelected(country))
      .filter(option => option.name.toLowerCase().includes(filterValue));
  }

  displayFn(option: Country | Skill): string {
    return option && option.name ? option.name : '';
  }

  selectedSkill(event: MatAutocompleteSelectedEvent): void {
    this.selectedSkills.push(event.option.value);
    this.skillsInput.nativeElement.value = '';
    this.form.controls.skills.setValue(null);
    this.form.controls.skills.updateValueAndValidity();
  }

  selectedCountry(event: MatAutocompleteSelectedEvent): void {
    this.selectedCountries.push(event.option.value);
    this.countriesInput.nativeElement.value = '';
    this.form.controls.countries.setValue(null);
    this.form.controls.countries.updateValueAndValidity();
  }

  addSkill(event: MatChipInputEvent): void {
    event.chipInput!.clear();
    this.form.controls.skills.setValue(null);
    this.form.controls.skills.updateValueAndValidity();
  }

  addCountry(event: MatChipInputEvent): void {
    event.chipInput!.clear();
    this.form.controls.countries.setValue(null);
    this.form.controls.countries.updateValueAndValidity();
  }

  removeSkill(skill: Skill): void {
    const index = this.selectedSkills.indexOf(skill);
    if (index >= 0) {
      this.selectedSkills.splice(index, 1);
    }
    this.form.controls.skills.updateValueAndValidity();
  }

  removeCountry(country: Country): void {
    const index = this.selectedCountries.indexOf(country);
    if (index >= 0) {
      this.selectedCountries.splice(index, 1);
    }
    this.form.controls.countries.updateValueAndValidity();
  }

  skillsValid(): ValidationErrors | null {
    if (this.selectedSkills.length === 0) {
      return {
        required: true,
      };
    }
    return null;
  }
}

@NgModule({
  declarations: [TaskFormComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    TranslateModule,
    MatInputModule,
    FlexLayoutModule,
    TaskFormatSelectorCardModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatIconModule,
    MatRadioModule,
  ],
})
export class TaskFormModule {}
