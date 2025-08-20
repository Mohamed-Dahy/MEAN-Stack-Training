import { Component, inject } from '@angular/core';
import { Eventservice } from '../services/eventsservice';
import { CommonModule } from '@angular/common';
import { EventModel } from '../models/eventModel';
import { UserService } from '../services/user-service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

@Component({
  selector: 'app-menu',
  imports: [CommonModule, FormsModule],
  templateUrl: './menu.html',
  styleUrl: './menu.css'
})
export class Menu {
  already_added = false;

  private eventService = inject(Eventservice);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private router = inject(Router);

  events: EventModel[] = [];
  selectedEvent: EventModel | null = null;

  ngOnInit(): void {
    this.loadAllEvents();
  }

  loadAllEvents() {
    this.eventService.getevents().subscribe({
      next: (events) => this.events = events,
      error: (error) => console.log(error)
    });
  }

  filterByCategory(category: string) {
    this.eventService.geteventByCategory(category).subscribe({
      next: (events) => this.events = events,
      error: (error) => console.log(error)
    });
  }

  private checkLogin(): boolean {
    const user = this.authService.user.value;
    if (!user?.token) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }

  addToFav(event: EventModel) {
    if (!this.checkLogin()) return;

    this.userService.addEventToFav(event._id).subscribe({
      next: (updatedFavs) => {
        console.log('Updated favorite events:', updatedFavs);
        alert(`${event.name} added to favorites!`);
        this.already_added = true;
      },
      error: (err) => {
        console.error('Error adding to favorites:', err);
        alert('Failed to add to favorites. Please try again.');
      }
    });
  }

  removefromfav(event: EventModel) {
    if (!this.checkLogin()) return;

    this.userService.removeEventFromFav(event._id).subscribe({
      next: (updatedFavs) => {
        console.log('Updated favorite events:', updatedFavs);
        alert(`${event.name} removed from favorites!`);
      },
      error: (err) => {
        console.error('Error removing from favorites:', err);
        alert('Failed to remove from favorites. Please try again.');
      }
    });
  }

  bookEvent(event: EventModel) {
    if (!this.checkLogin()) return;

    this.userService.bookevent(event._id).subscribe({
      next: (ticket) => {
        console.log('Ticket booked:', ticket);
        alert(`Successfully booked ${event.name}! View it in your profile`);
        window.location.reload();
      },
      error: (err) => {
        console.error('Error booking event:', err);
        alert('Failed to book event. Please try again.');
      }
    });
  }

  seeMore(event: EventModel) {
    this.selectedEvent = event;
  }

  closeModal() {
    this.selectedEvent = null;
  }
}
