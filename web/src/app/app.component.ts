import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  // test
  title = 'CBPV Platform';

  constructor(
    private readonly matIconRegistry: MatIconRegistry,
    private readonly domSanitizer: DomSanitizer,
    private readonly translateService: TranslateService,
  ) {
    this.translateService.setDefaultLang('en');
    this.addSVGIcons();
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
