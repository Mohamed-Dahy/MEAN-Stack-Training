import { Component, inject , Injectable, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth-service';
import { UserService } from '../services/user-service';
import { catchError, map, throwError } from "rxjs";
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
@Component({
  selector: 'app-login',
  imports: [CommonModule,FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {  
private authService = inject(AuthService)
iserror = false
errormsg =''
token = ''
@ViewChild("loginform") loginform !: NgForm
setAutofill() {
  this.loginform.form.patchValue({
    email: 'elsayed@gmail.com',
    password: '119200444'
  });
}
onsubmit() {
this.authService.loginAsAdmin(this.loginform.value.email, this.loginform.value.password).subscribe({
      next: (token) => {
        console.log(token);
        // clear the form after successful login
        this.loginform.reset();
      },
      error: (error) => {
        console.log(error)
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