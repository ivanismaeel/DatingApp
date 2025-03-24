import {BsModalRef} from 'ngx-bootstrap/modal';
import {Component, inject} from '@angular/core';

@Component({
  selector: 'app-config-dialog',
  imports: [],
  templateUrl: './config-dialog.component.html',
  styleUrl: './config-dialog.component.css'
})
export class ConfigDialogComponent {

  BsModalRef = inject(BsModalRef)

  title = ''
  message = ''
  btnOkText = ''
  btnCancelText = ''
  result = false

  confirm () {
    this.result = true
    this.BsModalRef.hide()
  }

  decline () {
    this.BsModalRef.hide()
  }
}
