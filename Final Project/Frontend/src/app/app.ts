import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import { Observable, Observer , filter , of } from 'rxjs'; 
import { EventList } from './event-list/event-list';  
import {Login} from './login/login'
import { UserProfile } from './user-profile/user-proflie';
import { AuthService } from './services/auth-service';
import { AdminProfile } from './admin-profile/admin-profile';

@Component({
  selector: 'app-root',
  imports: [ CommonModule, FormsModule, EventList,Login, UserProfile  , AdminProfile ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private authservice = inject(AuthService);
  ngOnInit(){
    this.authservice.autoLogin();
  }

}