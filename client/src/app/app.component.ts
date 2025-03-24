import {Component, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';

import {NgxSpinnerComponent} from 'ngx-spinner';

import {AccountService} from './_services/account.service';
import {NavComponent} from './nav/nav.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavComponent, NgxSpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {

  private readonly accountService = inject(AccountService);
  ngOnInit (): void {
    this.setCurrentUser();
  }

  private setCurrentUser () {
    const userString = localStorage.getItem('user');
    if (!userString) return;

    const user = JSON.parse(userString);
    this.accountService.currentUser.set(user);
    this.accountService.setCurrentUser(user);
  }
}
