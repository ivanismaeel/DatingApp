import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {environment} from '../../environments/environment.development';
import {User} from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly baseUrl = environment.apiUrl;
  private readonly url = `${this.baseUrl}/admin`;

  private readonly http = inject(HttpClient)

  getUserWithRoles () {
    return this.http.get<User[]>(`${this.url}/users-with-roles`)
  }

  updateUserRoles (username: string, roles: string[]) {
    return this.http.post<string[]>(`${this.url}/edit-roles/${username}?roles=${roles}`, {})
  }
}
