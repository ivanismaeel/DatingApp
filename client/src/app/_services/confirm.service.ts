import {inject, Injectable} from '@angular/core';
import {BsModalRef, BsModalService, ModalOptions} from 'ngx-bootstrap/modal';
import {ConfigDialogComponent} from '../modals/config-dialog/config-dialog.component';
import {map} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {

  bsModalRef?: BsModalRef
  private readonly modalService = inject(BsModalService)

  confirm (
    title = 'Confirmation',
    message = 'Are you sure?',
    btnOkText = 'Ok',
    btnCancelText = 'Cancel'
  ) {
    const config: ModalOptions = {
      initialState: {
        title,
        message,
        btnOkText,
        btnCancelText
      }
    }

    this.bsModalRef = this.modalService.show(ConfigDialogComponent, config)

    return this.bsModalRef.onHide?.pipe(
      map(_ => this.bsModalRef?.content ? this.bsModalRef.content.result : false)
    )
  }
}
