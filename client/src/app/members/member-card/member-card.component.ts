import {Component, computed, inject, input} from '@angular/core';
import {RouterLink} from '@angular/router';

import {Member} from './../../_models/member';
import {LikesService} from './../../_services/likes.service';
import {PresenceService} from './../../_services/presence.service';

@Component({
  selector: 'app-member-card',
  imports: [RouterLink],
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.css'
})
export class MemberCardComponent {

  private readonly likesService = inject(LikesService)
  private readonly presenceService = inject(PresenceService)

  member = input.required<Member>()
  hasLiked = computed(() => this.likesService.likeIds().includes(this.member().id))
  isOnline = computed(() => this.presenceService.onlineUsers().includes(this.member().username))

  toggleLike = () => this.likesService.toggleLike(this.member().id).subscribe({
    next: () => {
      if (this.hasLiked())
      {
        this.likesService.likeIds.update(ids => ids.filter(id => id !== this.member().id))
      } else
      {
        this.likesService.likeIds.update(ids => [...ids, this.member().id])
      }
    }
  })
}
