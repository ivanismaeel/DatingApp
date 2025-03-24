import {HttpClient, HttpResponse} from '@angular/common/http';
import {inject, Injectable, signal} from '@angular/core';
import {of} from 'rxjs';

import {environment} from '../../environments/environment';
import {Member} from '../_models/member';
import {PaginatedResponse} from '../_models/pagination';
import {Photo} from '../_models/photo';
import {UserParams} from '../_models/userParams';
import {AccountService} from './account.service';
import {setPaginationHeaders, setPaginatedResponse} from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  private readonly http = inject(HttpClient)
  private readonly accountService = inject(AccountService)

  private readonly baseUrl = environment.apiUrl
  private readonly user = this.accountService.currentUser()

  paginatedResponse = signal<PaginatedResponse<Member[]> | null>(null)
  memberCache = new Map<string, HttpResponse<Member[]>>()
  userParams = signal(new UserParams(this.user))

  resetUserParams () {
    this.userParams.set(new UserParams(this.user))
  }

  getMembers () {
    const response = this.memberCache.get(Object.values(this.userParams()).join('-'))
    if (response) return setPaginatedResponse(response, this.paginatedResponse)

    const {pageNumber, pageSize, minAge, maxAge, gender, orderBy} = this.userParams()

    let params = setPaginationHeaders(pageNumber, pageSize)

    params = params.append('minAge', minAge)
    params = params.append('maxAge', maxAge)
    params = params.append('gender', gender)
    params = params.append('orderBy', orderBy)

    return this.http.get<Member[]>(`${this.baseUrl}/users`, {observe: 'response', params}).subscribe({
      next: response => {
        if (response)
        {
          setPaginatedResponse(response, this.paginatedResponse)
          this.memberCache.set(Object.values(this.userParams()).join('-'), response)
        }

      }
    })
  }

  getMember (username: string) {

    const member = [...this.memberCache.values()].reduce((arr, elem) => {
      if (elem.body) return arr.concat(elem.body)

      return arr
    }, [] as Member[]).find(m => m.username === username)

    if (member) return of(member)

    return this.http.get<Member>(`${this.baseUrl}/users/${username}`)
  }

  updateMember (member: Member) {
    return this.http.put(`${this.baseUrl}/users`, member).pipe(
      // tap(() => {
      //   const index = this.members().findIndex(m => m.userName === member.userName)
      //   this.members.update(members => {
      //     members[ index ] = member
      //     return members
      //   })
      // })
    )
  }

  setMainPhoto (photo: Photo) {
    return this.http.put(`${this.baseUrl}/users/set-main-photo/${photo.id}`, {}).pipe(
      // tap(() => {
      //   this.members.update(members => members.map(m => {
      //     if (m.photos.includes(photo)) m.photoUrl = photo.url

      //     return m
      //   })
      //   )
      // })
    )
  }

  deletePhoto (photo: Photo) {
    return this.http.delete(`${this.baseUrl}/users/delete-photo/${photo.id}`).pipe(
      // tap(() => {
      //   this.members.update(members => members.map(m => {
      //     if (m.photos.includes(photo)) m.photos = m.photos.filter(p => p.id !== photo.id)

      //     return m
      //   })
      //   )
      // })
    )
  }

}
