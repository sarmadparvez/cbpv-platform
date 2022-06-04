import { Component, NgModule, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-subscriptions',
  template: '',
})
export class SubscriptionComponent implements OnDestroy {
  subscriptions = new Subscription();
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}

@NgModule({
  imports: [CommonModule],
  declarations: [SubscriptionComponent],
})
export class SubscriptionModule {}
