import {DatePipe} from '@angular/common';
import {Component, inject, viewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {HubConnectionState} from '@microsoft/signalr';
import {GalleryItem, GalleryModule, ImageItem} from 'ng-gallery';
import {TabDirective, TabsetComponent, TabsModule} from 'ngx-bootstrap/tabs';
import {TimeagoModule} from 'ngx-timeago';

import {AccountService} from './../../_services/account.service';
import {PresenceService} from './../../_services/presence.service';
import {Member} from '../../_models/member';
import {MessageService} from '../../_services/message.service';
import {MemberMessagesComponent} from "../member-messages/member-messages.component";

@Component({
  selector: 'app-member-detail',
  imports: [TabsModule, GalleryModule, DatePipe, TimeagoModule, MemberMessagesComponent],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.css'
})
export class MemberDetailComponent {

  private readonly router = inject(Router)
  private readonly route = inject(ActivatedRoute)
  private readonly presenceService = inject(PresenceService)
  private readonly messageService = inject(MessageService)
  private readonly accountService = inject(AccountService)

  memberTabs = viewChild<TabsetComponent>('memberTabs')
  activeTab?: TabDirective
  member: Member = {} as Member
  images: GalleryItem[] = []
  onlineUser = this.presenceService.onlineUsers

  ngOnInit (): void {
    this.route.data.subscribe({
      next: data => {
        this.member = data['member']
        this.member && this.member.photos.forEach(photo => {
          this.images.push(new ImageItem({
            src: photo.url,
            thumb: photo.url
          }))
        })
      }
    })

    this.route.paramMap.subscribe({
      next: _ => this.onRouteParamsChange()
    })

    this.route.queryParams.subscribe({
      next: params => {
        params['tab'] && this.selectTab(params['tab'])
      }
    })
  }

  selectTab (heading: string) {
    if (this.memberTabs())
    {
      const messageTab = this.memberTabs()?.tabs.find(tab => tab.heading === heading)
      if (messageTab) messageTab.active = true
    }

  }

  onRouteParamsChange () {
    const user = this.accountService.currentUser()
    if (!user) return

    if (this.messageService.hubConnection?.state === HubConnectionState.Connected
      && this.activeTab?.heading === 'Messages')
    {
      this.messageService.hubConnection.stop().then(() => {
        this.messageService.createHubConnection(user, this.member.username)
      })

    }
  }

  onTabActivated (data: TabDirective) {
    this.activeTab = data
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {tab: this.activeTab.heading},
      queryParamsHandling: 'merge'
    })
    if (this.activeTab.heading === 'Messages' && this.member)
    {
      const user = this.accountService.currentUser()
      if (!user) return
      this.messageService.createHubConnection(user, this.member.username)
    }

    this.messageService.stopHubConnection()

  }

  ngOnDestroy (): void {
    this.messageService.stopHubConnection()
  }

}
