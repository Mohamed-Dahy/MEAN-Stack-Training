import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import {Usermodel } from '../models/usermodel';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient)
  private url = 'http://localhost:5000/Eventora/login';
   user = new BehaviorSubject<Usermodel | null>(null)

  login(email : string , password : string){
    return this.http.post<any>(this.url,{email,password}).pipe(
      map((response)=>{
        if(response.token){
          const decoded = jwtDecode<any>(response.token);
          const expirationdate = new Date(decoded.expiresIn * 1000);
          const loggeduser =new Usermodel(decoded.email , 
            decoded.id,
            response.token,
            expirationdate
          )

          this.user.next(loggeduser);
          return response.data.user;
        }else {
          throw new Error("token not found");
        }
        

      }),
      catchError(this.handleerror)
    )
  }

  
  private handleerror(error:any){
    let errorresponse ={
      status : 'fail',
      message : 'An unknown error occurred'
    }
    if(error.error && error.error.status && error.error.message){
      errorresponse = {
        status : error.error.status,
        message : error.error.message
      }
    }
    return throwError(()=>{
      errorresponse
    })
  }
}
