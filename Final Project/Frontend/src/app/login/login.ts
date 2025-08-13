import { Component, inject , Injectable } from '@angular/core';
import { AuthService } from '../services/auth-service';
import { UserService } from '../services/user-service';
import { catchError, map, throwError } from "rxjs";
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-login',
  imports: [CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {  
private authService = inject(AuthService)
iserror = false
errormsg =''
token = ''
onlogin(email : string = 'mohamed.dahy@example.com' , password : string = "StrongPass123"){
this.authService.login(email,password).subscribe({
  next:(token)=>{
    console.log(token);
  },
  error : (error)=>{
    console.log(error)
    this.iserror = true
    this.errormsg = error?.error?.message || error?.message || 'Login failed. Please check your credentials.';
    }
  })

}


// addeventtofav(eventid :string = '689158026edbd9df0f5065d8'){
// this.useerservice.addeventtofav(eventid).subscribe({
//   next : (data)=>{
//     console.log(data);
//   }
// })
// }
}
