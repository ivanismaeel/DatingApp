import {Component, ElementRef, inject, input, viewChild} from '@angular/core';
import {FormsModule, NgForm} from '@angular/forms';
import {TimeagoModule} from 'ngx-timeago';

import {MessageService} from './../../_services/message.service';

@Component({
  selector: 'app-member-messages',
  imports: [TimeagoModule, FormsModule],
  templateUrl: './member-messages.component.html',
  styleUrl: './member-messages.component.css'
})
export class MemberMessagesComponent {

  private readonly messageService = inject(MessageService)

  messages = this.messageService.messageThread
  messageForm = viewChild<NgForm>('messageForm')
  scrollContainer = viewChild<ElementRef<HTMLElement>>('scrollMe')
  username = input.required<string>()
  messageContent = ''

  private hasScrolledToBottom = false;

  sensMessage () {
    this.messageService.sendMessage(this.username(), this.messageContent).then(() => {
      this.messageForm()?.reset()
      this.scrollToBottom()
    })
  }

  ngAfterViewChecked (): void {
    if (!this.hasScrolledToBottom)
    {
      this.scrollToBottom();
    }
  }

  private scrollToBottom () {
    const el = this.scrollContainer()?.nativeElement
    if (el)
    {
      el.scrollTop = el.scrollHeight
      this.hasScrolledToBottom = true
    }
  }

}
