import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { exhaustMap, map, Observable, take } from 'rxjs';
import { AuthService } from './auth-service';
import { EventModel } from '../models/eventModel';

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
        if (!user) {
          throw new Error('User not authenticated');
        }
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

  // service to book an event

  bookevent(Eventid: string): Observable<any> {
    return this.authservice.user.pipe(
      take(1),
      exhaustMap((user) => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${user?.token}`,
        });

        return this.http
          .post<any>(`${this.URL}/bookevent/${Eventid}`, {},{ headers })
          .pipe(map((response) => response.data.ticket));
      })
    );
  }


  cancelbooking(ticketid:string): Observable<any> {
    return this.authservice.user.pipe(
      take(1),
      exhaustMap((user) => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${user?.token}`,
        });

        return this.http
          .delete<any>(`${this.URL}/cancelbooking/${ticketid}`, { headers: headers })
          .pipe(map((response) => response.data.ticket));
      })
    );
  }

  createEvent(event: any): Observable<any> {
    return this.authservice.user.pipe(
      take(1),
      exhaustMap((user) => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${user?.token}`,
        });

        return this.http
          .post<any>(`${this.URL}/createEvent`, event, { headers })
          .pipe(map((response) => response.data.event));
      })
    );
  }

  updateEvent(id: string , updateddata : Partial<EventModel>): Observable<any> {
    return this.authservice.user.pipe(
      take(1),
      exhaustMap((user) => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${user?.token}`,
        });

        if (!user) {
          throw new Error('User not authenticated');
        }

        return this.http
          .patch<any>(`${this.URL}/updateEvent/${id}`, updateddata, { headers })
          .pipe(map((response) => response.data.event));
      })
    );}

    deleteEvent(id:string): Observable<any> {
      return this.authservice.user.pipe(
        take(1),
        exhaustMap((user) => {
          const headers = new HttpHeaders({
            Authorization: `Bearer ${user?.token}`,
          });

          if (!user) {
            throw new Error('User not authenticated');
          }

          return this.http
            .delete<any>(`${this.URL}/deleteEvent/${id}`, { headers })
            .pipe(map((response) => response.data.event));
        })
      );
    }
}

