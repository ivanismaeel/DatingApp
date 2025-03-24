import { Router } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-server-error',
  imports: [],
  templateUrl: './server-error.component.html',
  styleUrl: './server-error.component.css',
})
export class ServerErrorComponent {
  error: any;

  constructor(private readonly router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation) {
      this.error = navigation.extras.state?.['error'];
    }
  }
}
