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
  private url2 = 'http://localhost:5000/Eventora/loginasAdmin';
  private url3 = 'http://localhost:5000/Eventora/signup';
   user = new BehaviorSubject<Usermodel | null>(null)

  login(email : string , password : string){
    return this.http.post<any>(this.url,{email,password}).pipe(
      map((response)=>{
        if(response.token){
          const decoded = jwtDecode<any>(response.token);
          const expirationdate = new Date(decoded.exp * 1000); // Convert seconds to milliseconds
          const loggeduser =new Usermodel(decoded.email , 
            decoded.id,
            response.token,
            expirationdate
          )

          this.user.next(loggeduser);
          localStorage.setItem('userdata', JSON.stringify(loggeduser));
          return response.data.user;
        }else {
          throw new Error("token not found");
        }
        

      }),
      catchError(this.handleerror)
    )
  }
  loginAsAdmin(email: string, password: string) {
    return this.http.post<any>(`${this.url2}`, { email, password }).pipe(
      map((response) => {
        if (response.token) {
          const decoded = jwtDecode<any>(response.token);
          const expirationdate = new Date(decoded.exp * 1000); // Convert seconds to milliseconds
          const loggeduser = new Usermodel(
            decoded.email,
            decoded.id,
            response.token,
            expirationdate
          );

          this.user.next(loggeduser);
          localStorage.setItem('userdata', JSON.stringify(loggeduser));
          return response.data.user;
        } else {
          throw new Error("token not found");
        }
      }),
      catchError(this.handleerror)
    );
  }

   autoLogin() { 
    const userDataString = localStorage.getItem('userdata');
    if (!userDataString) return;

    const userData = JSON.parse(userDataString);
    const loadedUser = new Usermodel(
      userData.email,
      userData._id,
      userData._token,
      new Date(userData.expiresIn)
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
    }
  }

  logout(){
    this.user.next(null);
    localStorage.removeItem('userdata');
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



 signup(newUser: any) {
  return this.http.post<any>(`${this.url3}`, newUser).pipe(
    map((response) => {
      if (response.token) {
        const decoded = jwtDecode<any>(response.token);
        const expirationDate = new Date(decoded.exp * 1000);
        const loggedInUser = new Usermodel(
          decoded.email,
          decoded.id,
          response.token,
          expirationDate
        );
        this.user.next(loggedInUser);
        localStorage.setItem("userData", JSON.stringify(loggedInUser));

        return response.data.user;
      } else {
        throw new Error('Token not found in response');
      }
    }),
    catchError(this.handleerror)
  );
}
}
