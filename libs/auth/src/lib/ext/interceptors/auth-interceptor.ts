import type {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { UiMessageManager } from '@nucleus/ui';
import { catchError, from, type Observable, switchMap, throwError } from 'rxjs';
import { AuthToken } from '../services/auth-token';

@Service({ autoProvided: false })
export class AuthInterceptor implements HttpInterceptor {
  readonly #uiMessageManager = inject(UiMessageManager);
  readonly #authToken = inject(AuthToken);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return from(this.#authToken.getAccessToken()).pipe(
      switchMap((accessToken) => {
        const authRequest = request.clone({
          setHeaders: { Authorization: `Bearer ${accessToken}` },
        });

        return next.handle(authRequest).pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 0) {
              this.#uiMessageManager.addError(error.message);
            } else if (error.status === 401 && error.statusText === 'Unauthorized') {
              this.#authToken.deleteAccessToken();
              return throwError(() => error);
            }

            return next.handle(authRequest);
          }),
        );
      }),
    );
  }
}
