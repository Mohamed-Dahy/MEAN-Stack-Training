import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import { Observable, Observer , filter , of } from 'rxjs'; 
import { EventList } from './event-list/event-list';  
import {Login} from './login/login'
import { FavEvents } from './fav-events/fav-events';

@Component({
  selector: 'app-root',
  imports: [ CommonModule, FormsModule, EventList,Login, FavEvents ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

}