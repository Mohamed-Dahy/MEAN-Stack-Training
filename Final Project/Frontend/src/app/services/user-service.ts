import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { exhaustMap, map, Observable, take } from 'rxjs';
import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private authservice = inject(AuthService)
  private URL = 'http://localhost:5000/Eventora/userprofile'
  
  addEventToFav(eventId: string): Observable<string[]> {
    return this.authservice.user.pipe(
      take(1),
      exhaustMap((user) => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${user?.token}`,
        });

        return this.http
          .post<any>(`${this.URL}/addtofavoriteEvents`, { eventId }, { headers })
          .pipe(map((response) => response.data.favEvents));
      })
    );
  }


  removeEventFromFav(eventid: string): Observable<string[]> {
    return this.authservice.user.pipe(
      take(1),
      exhaustMap((user) => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${user?.token}`,
        });

        return this.http
        .delete<any>(`${this.URL}/favorite/${eventid}`, { headers })
          .pipe(map((response) => response.data.favEvents));
          
      })
    );
  }

  // servi ece to book an event

  bookevent(Eventid: string): Observable<any> {
    return this.authservice.user.pipe(
      take(1),
      exhaustMap((user) => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${user?.token}`,
        });

        return this.http
          .post<any>(`${this.URL}/bookevent/${Eventid}`, { headers })
          .pipe(map((response) => response.data.ticket));
      })
    );
  }
}

