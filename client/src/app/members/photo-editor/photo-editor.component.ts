import {Component, inject, input, output} from '@angular/core';
import {DecimalPipe, NgClass, NgFor, NgIf, NgStyle} from '@angular/common';
import {FileUploader, FileUploadModule} from 'ng2-file-upload';

import {Member} from '../../_models/member';
import {environment} from '../../../environments/environment.development';
import {Photo} from '../../_models/photo';
import {MembersService} from '../../_services/members.service';
import {AccountService} from './../../_services/account.service';

@Component({
  selector: 'app-photo-editor',
  imports: [NgFor, NgIf, NgStyle, NgClass, FileUploadModule, DecimalPipe],
  templateUrl: './photo-editor.component.html',
  styleUrl: './photo-editor.component.css'
})
export class PhotoEditorComponent {
  member = input.required<Member>()
  memberChange = output<Member>()

  uploader?: FileUploader
  hasBaseDropZoneOver = false
  baseUrl = environment.apiUrl

  private readonly accountService = inject(AccountService)
  private readonly memberService = inject(MembersService)

  ngOnInit (): void {
    this.initializeUploader()
  }

  fileOverBase (e: any) {
    this.hasBaseDropZoneOver = e

  }

  setMainPhoto (photo: Photo) {
    this.memberService.setMainPhoto(photo).subscribe({
      next: _ => {
        const user = this.accountService.currentUser()
        if (user)
        {
          user.photoUrl = photo.url
          this.accountService.setCurrentUser(user)
        }
        const UpdatedMember = {...this.member()}
        UpdatedMember.photoUrl = photo.url
        UpdatedMember.photos.forEach(p => {
          if (p.isMain) p.isMain = false
          if (p.id === photo.id) p.isMain = true
        })
        this.memberChange.emit(UpdatedMember)
      }
    })
  }
  initializeUploader () {
    this.uploader = new FileUploader({
      url: `${this.baseUrl}/users/add-photo`,
      authToken: 'Bearer ' + this.accountService.currentUser()?.token,
      isHTML5: true,
      autoUpload: false,
      removeAfterUpload: true,
      maxFileSize: 10 * 1024 * 1024
    })

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false
    }

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response)
      {
        const photo = JSON.parse(response)
        const UpdatedMember = {...this.member()}
        UpdatedMember.photos.push(photo)
        this.memberChange.emit(UpdatedMember)
        if (photo.isMain)
        {
          const user = this.accountService.currentUser()
          if (user)
          {
            user.photoUrl = photo.url
            this.accountService.setCurrentUser(user)
          }
          const UpdatedMember = {...this.member()}
          UpdatedMember.photoUrl = photo.url
          UpdatedMember.photos.forEach(p => {
            if (p.isMain) p.isMain = false
            if (p.id === photo.id) p.isMain = true
          })
          this.memberChange.emit(UpdatedMember)
        }
      }
    }
  }

  deletePhoto (photo: Photo) {
    this.memberService.deletePhoto(photo).subscribe({
      next: _ => {
        const UpdatedMember = {...this.member()}
        UpdatedMember.photos = UpdatedMember.photos.filter(p => p.id !== photo.id)
        this.memberChange.emit(UpdatedMember)
      }
    })
  }
}
