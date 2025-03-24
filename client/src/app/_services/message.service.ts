import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {environment} from '../../environments/environment.development';
import {Message} from '../_models/message';
import {PaginatedResponse} from '../_models/pagination';
import {setPaginatedResponse, setPaginationHeaders} from './paginationHelper';
import {User} from '../_models/user';
import {HubConnection, HubConnectionBuilder, HubConnectionState} from '@microsoft/signalr';
import {Group} from '../_models/group';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private readonly baseUrl = environment.apiUrl;
  private readonly hubsUrl = environment.hubsUrl;
  private readonly messagesUrl = `${this.baseUrl}/messages`;
  private readonly hubUrl = `${this.hubsUrl}/message`;
  hubConnection?: HubConnection;

  paginatedResponse = signal<PaginatedResponse<Message[]> | null>(null)
  messageThread = signal<Message[]>([])

  private readonly http = inject(HttpClient)

  createHubConnection (user: User, otherUsername: string) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${this.hubUrl}?user=${otherUsername}`, {
        accessTokenFactory: () => user.token
      })
      .withAutomaticReconnect()
      .build()

    this.hubConnection.start().catch(error => console.log(error))

    this.hubConnection.on('ReceiveMessageThread', messages => {
      this.messageThread.set(messages)
    })

    this.hubConnection.on('NewMessage', message => {
      this.messageThread.update(messages => [...messages, message])
    })

    this.hubConnection.on('UpdatedGroup', (group: Group) => {
      if (group.connections.some(c => c.username === otherUsername))
      {
        this.messageThread.update(messages => {
          messages.forEach(m => {
            if (!m.dateRead) m.dateRead = new Date(Date.now())
          })
          return [...messages]
        })
      }
    })
  }

  stopHubConnection () {
    if (this.hubConnection?.state === HubConnectionState.Connected)
    {
      this.hubConnection.stop().catch(error => console.log(error))
    }
  }

  getMessages (container: string, pageNumber: number, pageSize: number) {
    let params = setPaginationHeaders(pageNumber, pageSize)
    params = params.append('container', container)

    return this.http.get<Message[]>(`${this.messagesUrl}`, {observe: 'response', params}).subscribe({
      next: response => {
        if (response)
        {
          setPaginatedResponse(response, this.paginatedResponse)
        }
      }
    })
  }

  getMessageThread (username: string) {
    return this.http.get<Message[]>(`${this.messagesUrl}/thread/${username}`)
  }

  async sendMessage (username: string, content: string) {
    return this.hubConnection?.invoke('SendMessage', {recipientUsername: username, content})
  }

  deleteMessage (id: number) {
    return this.http.delete(`${this.messagesUrl}/${id}`)
  }
}
