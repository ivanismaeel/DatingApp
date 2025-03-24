import {Component, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {RouterLink} from '@angular/router';

import {UserModel} from './../_models/userModel';
import {RegisterComponent} from '../register/register.component';
import {environment} from '../../environments/environment.development';

@Component({
  selector: 'app-home',
  imports: [RegisterComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {

  registerMode = false;
  isRegistered = false;

  private readonly baseUrl = environment.apiUrl
  private readonly http = inject(HttpClient);

  ngOnInit (): void {
    this.getUsers();
    this.checkRegistrationStatus();
  }
  registerToggle () {
    this.registerMode = !this.registerMode;
  }

  cancelRegisterMode (event: boolean) {
    this.registerMode = event;
  }

  private getUsers () {
    this.http.get<UserModel>(`${this.baseUrl}/users`).subscribe({
      error: err => console.log(err)
    });
  }

  private checkRegistrationStatus () {
    const userString = localStorage.getItem('user');
    if (userString)
    {
      this.isRegistered = true;
    } else
    {
      this.isRegistered = false;
    }
  }
}
