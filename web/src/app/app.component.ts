import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { PermissionsService } from './iam/permission.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    private readonly matIconRegistry: MatIconRegistry,
    private readonly domSanitizer: DomSanitizer,
    private readonly translateService: TranslateService,
    private readonly permService: PermissionsService,
    private spinner: NgxSpinnerService,
  ) {
    this.translateService.setDefaultLang('en');
    this.addSVGIcons();
    this.subscribeLoadingIndicator();
  }

  async subscribeLoadingIndicator() {
    this.permService.loading.subscribe(loading => {
      if (loading) {
        this.spinner.show();
      } else {
        this.spinner.hide();
      }
    });
  }

  addSVGIcons() {
    const icons = ['google_logo'];
    icons.forEach(icon => {
      this.matIconRegistry.addSvgIcon(
        `${icon}`,
        this.domSanitizer.bypassSecurityTrustResourceUrl(
          `../assets/icons/${icon}.svg`,
        ),
      );
    });
  }
}
