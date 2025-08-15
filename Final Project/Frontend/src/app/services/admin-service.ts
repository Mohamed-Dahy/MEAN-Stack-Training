import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { exhaustMap, map, Observable, take } from 'rxjs';
import { EventModel } from '../models/eventModel';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  
  private http = inject(HttpClient);
  private authservice = inject(AuthService)
  private URL = 'http://localhost:5000/Eventora/adminprofile';

  
  createEvent(event: any): Observable<any> {
    return this.authservice.user.pipe(
      take(1),
      exhaustMap((admin) => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${admin?.token}`,
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
        exhaustMap((admin) => {
          const headers = new HttpHeaders({
            Authorization: `Bearer ${admin?.token}`,
          });  
          return this.http
            .patch<any>(`${this.URL}/updateEvent/${id}`, updateddata, { headers })
            .pipe(map((response) => response.data.event));
        })
      );
  }
  deleteEvent(id:string): Observable<any> {
      return this.authservice.user.pipe(
        take(1),
        exhaustMap((admin) => {
          const headers = new HttpHeaders({
            Authorization: `Bearer ${admin?.token}`,
          });

          if (!admin) {
            throw new Error('User not authenticated');
          }

          return this.http
            .delete<any>(`${this.URL}/deleteEvent/${id}`, { headers })
            .pipe(map((response) => response.data.event));
        })
      );
    }



    getAllusers(): Observable<any> {
      return this.authservice.user.pipe(
        take(1),
        exhaustMap((admin) => {
          const headers = new HttpHeaders({
            Authorization: `Bearer ${admin?.token}`,
          });

          return this.http
            .get<any>(`${this.URL}/users`, { headers })
            .pipe(map((response) => response.data.users));
        })
      );
    }

    getuserbyid(userid:string): Observable<any> {
      return this.authservice.user.pipe(
        take(1),
        exhaustMap((admin) => {
          const headers = new HttpHeaders({
            Authorization: `Bearer ${admin?.token}`,
          });

          return this.http
            .get<any>(`${this.URL}/user/${userid}`, { headers })
            .pipe(map((response) => response.data.user));
        })
      );
    }
      deleteuserbyid(userid:string): Observable<any> {
      return this.authservice.user.pipe(
        take(1),
        exhaustMap((admin) => {
          const headers = new HttpHeaders({
            Authorization: `Bearer ${admin?.token}`,
          });

          return this.http
            .delete<any>(`${this.URL}/user/${userid}`, { headers })
            .pipe(map((response) => response.data.user));
        })
      );
    }
    getbookedusers(eventid: string): Observable<any> {
      return this.authservice.user.pipe(
        take(1),
        exhaustMap((admin) => {
          const headers = new HttpHeaders({
            Authorization: `Bearer ${admin?.token}`,
          });

          return this.http
            .get<any>(`${this.URL}/bookedUsers/${eventid}`, { headers })
            .pipe(map((response) => response.data.bookedUsers));
        })
      );
    }
  
  
}
