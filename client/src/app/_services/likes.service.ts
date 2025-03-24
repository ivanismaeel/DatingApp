import {HttpClient} from '@angular/common/http';
import {inject, Injectable, signal} from '@angular/core';
import {environment} from '../../environments/environment.development';
import {Member} from '../_models/member';
import {PaginatedResponse} from '../_models/pagination';
import {setPaginatedResponse, setPaginationHeaders} from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class LikesService {
  private readonly baseUrl = environment.apiUrl;
  private readonly likesUrl = `${this.baseUrl}/likes`;

  likeIds = signal<number[]>([])
  paginatedResponse = signal<PaginatedResponse<Member[]> | null>(null)

  private readonly http = inject(HttpClient)

  toggleLike (targetId: number) {

    return this.http.post(`${this.likesUrl}/${targetId}`, {})
  }
  getLikes (predicate: string, pageNumber: number, pageSize: number) {
    let params = setPaginationHeaders(pageNumber, pageSize)
    params = params.append('predicate', predicate)

    return this.http.get<Member[]>(`${this.likesUrl}`, {observe: 'response', params}).subscribe({
      next: response => {
        if (response)
        {
          setPaginatedResponse(response, this.paginatedResponse)
        }
      }
    })
  }

  getLikeIds () {
    return this.http.get<number[]>(`${this.likesUrl}/list`).subscribe({
      next: ids => this.likeIds.set(ids)
    })
  }
}
