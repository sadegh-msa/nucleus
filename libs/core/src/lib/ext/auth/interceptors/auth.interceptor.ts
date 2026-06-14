import type {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { MessageService } from '@nucleus/fabric';
import { catchError, type Observable } from 'rxjs';
import { AuthTokenService } from '../services/auth-token.service';

@Service({ autoProvided: false })
export class AuthInterceptor implements HttpInterceptor {
  readonly #messageService = inject(MessageService);
  readonly #authTokenService = inject(AuthTokenService);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const accessToken = this.#authTokenService.getAccessToken();
    const authRequest = request.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` },
    });

    return next.handle(authRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 0) {
          this.#messageService.addError(error.message);
        } else if (error.status === 401 && error.statusText === 'Unauthorized') {
          this.#authTokenService.deleteAccessToken();
        }

        return next.handle(authRequest);
      }),
    );
  }
}
