import {Component, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';

import {ButtonsModule} from 'ngx-bootstrap/buttons';
import {TimeagoModule} from 'ngx-timeago';
import {PageChangedEvent, PaginationModule} from 'ngx-bootstrap/pagination';

import {Message} from './../_models/message';
import {MessageService} from './../_services/message.service';

@Component({
  selector: 'app-messages',
  imports: [FormsModule, ButtonsModule, TimeagoModule, RouterLink, PaginationModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent {
  private readonly messageService = inject(MessageService)

  messages = this.messageService.paginatedResponse
  container = 'Inbox'
  pageNumber = 1
  pageSize = 5
  isOutbox = this.container === 'Outbox'

  ngOnInit (): void {
    this.loadMessages()
  }

  loadMessages () {
    this.messageService.getMessages(this.container, this.pageNumber, this.pageSize)
  }

  deleteMessage (id: number) {
    this.messageService.deleteMessage(id).subscribe({
      next: () => {
        this.messageService.paginatedResponse.update(prev => {
          prev?.items?.splice(prev.items.findIndex(m => m.id === id), 1)
          return prev
        })
      }
    })
  }

  getRoute (message: Message) {
    if (this.container === 'Outbox') return `/members/${message.recipientUsername}`

    return `/members/${message.senderUsername}`
  }
  pageChanged (event: PageChangedEvent) {
    if (event.page !== this.pageNumber)
    {
      this.pageNumber = event.page
      this.loadMessages()
    }
  }
}
