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
  loading = false
  serverError = ''
private authService = inject(AuthService)
iserror = false
errormsg =''
token = ''
@ViewChild("loginform") loginform !: NgForm
onsubmit() {    
this.authService.login(this.loginform.value.email, this.loginform.value.password).subscribe({
      next: (token) => {
        console.log(token);
        this.loading = false;
        // clear the form after successful login
        this.loginform.reset();
        
      },
      error: (error) => {
        console.log(error)
      }
    });
  }

}
