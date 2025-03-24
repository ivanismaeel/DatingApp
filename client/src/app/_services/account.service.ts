import {computed, inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs';

import {PresenceService} from './presence.service';
import {LikesService} from './likes.service';
import {User} from '../_models/user';
import {UserModel} from '../_models/userModel';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AccountService {

  private readonly http = inject(HttpClient);
  private readonly likesService = inject(LikesService);
  private readonly presenceService = inject(PresenceService);
  private readonly baseUrl = environment.apiUrl;

  currentUser = signal<User | null>(null);
  roles = computed(() => {
    const user = this.currentUser();
    if (!user) return [];
    const roles = JSON.parse(atob(user.token.split('.')[1])).role
    return Array.isArray(roles) ? roles : [roles];
  })

  login (model: UserModel) {
    return this.http.post<User>(`${this.baseUrl}/account/login`, model).pipe(
      map((user) => {
        if (user)
        {
          this.setCurrentUser(user);
        }
      })
    );
  }

  register (model: UserModel) {
    return this.http.post<User>(`${this.baseUrl}/account/register`, model).pipe(
      map((user) => {
        if (user)
        {
          this.setCurrentUser(user)
        }
        return user;
      })
    );
  }

  setCurrentUser (user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUser.set(user);
    this.likesService.getLikeIds();
    this.presenceService.createHubConnection(user);
  }

  logout () {
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.presenceService.stopHubConnection();
  }
}
