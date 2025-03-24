import { inject, Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class BusyService {

  busyRequestCount = 0

  private readonly spinner = inject(NgxSpinnerService)

  busy () {
    this.busyRequestCount++
    this.spinner.show(undefined, {
      type: 'ball-clip-rotate-multiple',
      bdColor: 'rgba(0, 0, 0, 0.5)',
      color: '#fff'
    })
  }

  idle () {
    this.busyRequestCount--
    if (this.busyRequestCount <= 0)
    {
      this.busyRequestCount = 0
      this.spinner.hide()
    }
  }
}
