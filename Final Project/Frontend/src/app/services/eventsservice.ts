import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { response } from 'express';
import { EventModel } from '../models/eventModel';



@Injectable({
  providedIn: 'root'
})
export class Eventservice {
private http = inject(HttpClient);
private url1 = 'http://localhost:5000/Eventora/events';
private url2 = 'http://localhost:5000/Eventora/events';
private url3 = 'http://localhost:5000/Eventora/category';


getevents() : Observable<EventModel[]>{
  return this.http.get<any>(this.url1).pipe(
    map((response)=>{
       return response.data.events;
    })
  )  
}


geteventById(_id : string) : Observable<EventModel> {
  return this.http.get<any>(`${this.url2}/${_id}`).pipe(
    map((response) => {
      return response.data.event;
    })
  );

}

geteventByCategory(category :string) : Observable<EventModel[]> {
  return this.http.get<any>(`${this.url3}/${category}`).pipe(
    map((response) => {
      return response.data.events;
    })
  );
}

}
