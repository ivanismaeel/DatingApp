import {inject, Injectable, signal} from '@angular/core';

import {ToastrService} from 'ngx-toastr';
import {HubConnectionBuilder, HubConnection, HubConnectionState} from '@microsoft/signalr';

import {environment} from '../../environments/environment.development';
import {User} from './../_models/user';
import {Router} from '@angular/router';
import {take} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {

  hubUrl = environment.hubsUrl
  private hubConnection?: HubConnection
  onlineUsers = signal<string[]>([])

  private readonly Toastr = inject(ToastrService)
  private readonly router = inject(Router)

  createHubConnection (user: User) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${this.hubUrl}/presence`, {
        accessTokenFactory: () => user.token
      })
      .withAutomaticReconnect()
      .build()

    this.hubConnection.start().catch(error => console.log(error))

    this.hubConnection.on('UserIsOnline', username => {
      this.Toastr.success(`${username} is online`)
      this.updateOnlineUsers(username, true);
    })

    this.hubConnection.on('UserIsOffline', username => {
      this.Toastr.warning(`${username} is offline`)
      this.updateOnlineUsers(username, false);
    })

    this.hubConnection.on('GetOnlineUsers', (usernames: string[]) => {
      this.onlineUsers.set(usernames);
    });

    this.hubConnection.on("NewMessageReceived", ({username, knownAs}) => {
      this.Toastr.info(`${knownAs} has sent you a new message! Click me to see it`)
        .onTap
        .pipe(take(1))
        .subscribe(() => this.router.navigateByUrl(`/members/${username}?tab=Messages`))
    })
  }

  stopHubConnection () {

    if (this.hubConnection?.state === HubConnectionState.Connected)
    {
      this.hubConnection?.stop().catch(error => console.log(error))
    }
  }

  private updateOnlineUsers (username: string, isOnline: boolean) {
    if (isOnline)
    {
      this.onlineUsers.update(users => [...users, username]);
    } else
    {
      this.onlineUsers.update(users => users.filter(user => user !== username));
    }
  }

}