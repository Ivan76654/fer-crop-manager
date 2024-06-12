import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { User } from './user.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

type UserData = {
  username: string;
  userId: string;
  _token: string;
  _tokenExpirationDate: string;
};

interface AuthResponse {
  token: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user = new BehaviorSubject<User | null>(null);
  private tokenExpirationTimer: any;
  private tokenExpiresInMilis: number =
    environment.thingsboardConfig.tokenExpiresIn * 60 * 60 * 1000;

  constructor(private httpClient: HttpClient, private router: Router) {}

  isAuthenticated(): boolean {
    return true;
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.httpClient
      .post<AuthResponse>(`${environment.thingsboardConfig.hostUrl}/api/auth/login`, {
        username: username,
        password: password
      })
      .pipe(
        catchError(this.handleError),
        tap((response) => {
          this.handleAuthentication(username, response.token);
        })
      );
  }

  autoLogin(): void {
    const userDataString = localStorage.getItem('userData');

    if (!userDataString) return;

    const userData: UserData = JSON.parse(userDataString);

    const loadedUser = new User(
      userData.username,
      userData.userId,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);

      const expirationDuration = loadedUser.tokenExpirationDate.getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logout(): Observable<any> {
    return this.httpClient
      .post<any>(`${environment.thingsboardConfig.hostUrl}/api/auth/logout`, {})
      .pipe(
        tap((response) => {
          this.router.navigate(['/login']);
          this.user.next(null);
          localStorage.removeItem('userData');

          if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
          }

          this.tokenExpirationTimer = null;
        })
      );
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout().subscribe((response) => {});
    }, expirationDuration);
  }

  private handleAuthentication(username: string, token: string): void {
    const expirationDate = new Date(new Date().getTime() + this.tokenExpiresInMilis);
    const user = new User(username, '', token, expirationDate);

    this.user.next(user);
    this.autoLogout(this.tokenExpiresInMilis);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorResponse: HttpErrorResponse) {
    if (!errorResponse.error) return throwError(() => 'An error occurred!');

    return throwError(() => {
      return errorResponse.error.message;
    });
  }
}
