import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth-service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink,RouterLinkActive,CommonModule,FormsModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  private router = inject(Router)
  private authservice = inject(AuthService)
userData: any = null;
  isAdmin: boolean = false;
  isLoggedIn: boolean = false;

  ngOnInit(): void {
    const storedUser = localStorage.getItem('userdata');
    if (storedUser) {
      this.userData = JSON.parse(storedUser);
      this.isLoggedIn = true

      // check email
      if (this.userData.email === 'admin@gmail.com') {
        this.isAdmin = true;
      }
    }
  }

logout(): void {
  this.authservice.logout();   

  this.userData = null;
  this.isAdmin = false;
  this.isLoggedIn = false;

  this.router.navigate(['/login']); 
}



}