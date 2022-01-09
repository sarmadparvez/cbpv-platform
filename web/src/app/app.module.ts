import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavModule } from './navigation/nav.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
} from '@angular/common/http';
import { HttpConfigInterceptor } from './http/interceptor.service';
import {
  ApiModule as AdminApiModule,
  Configuration as AdminConfiguration,
  ConfigurationParameters as AdminConfigurationParameters,
} from '../../gen/api/admin';
import {
  ApiModule as TaskApiModule,
  Configuration as TaskConfiguration,
  ConfigurationParameters as TaskConfigurationParameters,
} from '../../gen/api/task';
import { environment } from '../environments/environment';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

export function adminServiceConfigFactory(): AdminConfiguration {
  const params: AdminConfigurationParameters = {
    // set configuration parameters here.
    basePath: environment.adminServiceUrl,
  };
  return new AdminConfiguration(params);
}

export function taskServiceConfigFactory(): TaskConfiguration {
  const params: TaskConfigurationParameters = {
    // set configuration parameters here.
    basePath: environment.taskServiceUrl,
  };
  return new TaskConfiguration(params);
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    AdminApiModule.forRoot(adminServiceConfigFactory),
    TaskApiModule.forRoot(taskServiceConfigFactory),
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    AppRoutingModule,
    NavModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatSnackBarModule,
    MatDialogModule,
    MatPaginatorModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpConfigInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
