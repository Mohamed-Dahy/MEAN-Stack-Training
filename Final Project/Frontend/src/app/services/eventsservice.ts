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


getevents() : Observable<Event[]>{
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





































// private http = inject(HttpClient);
// private url = 'http://localhost:5000/Eventora/events';


//     getMovie() : Observable<Event[]>{
//       return  this.http
//       .get<any>(this.url)
//       .pipe(map((response) => response.data.events));
//     }

//     addEvent(event: Event): Observable<Event[]> {
//       return this.http.post<Event[]>(this.url, event)
//         .pipe(map((response: any) => response.data.events));

//     }
  // addMovie(movie: Movie) : Observable<Movie[]> {
  //   return new Observable((observer) => {
  //     this.movies.push(movie);
  //     observer.next(this.movies);
  //   });
  // }
  // updateMovie(id: number, updatedTask: Partial<Movie>): Observable<Movie[]> {
  //   return new Observable((observer) => {
  //     const taskIndex = this.movies.findIndex((t) => t.id === id);
  //     if(taskIndex !== -1){
  //       this.movies[taskIndex] = { ...this.movies[taskIndex], ...updatedTask };
  //     }
  //     observer.next(this.movies);
  //   })
  // }

  // deleteMovie(id : number) : Observable<Movie[]> {
  //   return new Observable((observer) => {
  //     this.movies = this.movies.filter((t) => t.id !== id);
  //     observer.next(this.movies);
  //   });
  // }
}
