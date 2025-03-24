import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideRouter} from '@angular/router';

import {ModalModule} from 'ngx-bootstrap/modal';
import {NgxSpinnerModule} from "ngx-spinner";
import {TimeagoModule} from "ngx-timeago";
import {provideToastr} from 'ngx-toastr';

import {errorInterceptor} from './_interceptors/error.interceptor';
import {jwtInterceptor} from './_interceptors/jwt.interceptor';
import {loadingInterceptor} from './_interceptors/loading.interceptor';
import {routes} from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideHttpClient(withInterceptors([errorInterceptor, jwtInterceptor, loadingInterceptor])),
    provideAnimations(),
    importProvidersFrom(NgxSpinnerModule, TimeagoModule.forRoot(), ModalModule.forRoot()),
    provideToastr({
      timeOut: 10000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
  ],
};
