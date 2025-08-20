import { Component, inject, OnInit } from '@angular/core';
import { Eventservice } from '../services/eventsservice'
import { Observable } from 'rxjs';
import { EventModel } from '../models/eventModel';
import { UserService } from '../services/user-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-event-list',
  imports: [CommonModule,FormsModule],
  templateUrl: './event-list.html',
  styleUrl: './event-list.css'
})
export class EventList  implements OnInit { already_added = false;

private eventService = inject(Eventservice);
private userService = inject(UserService);
  events: EventModel[] = [];
  ngOnInit(): void {
    this.loadAllEvents();
  }

    loadAllEvents() {

    this.eventService.getevents().subscribe({
      next: (events) => {
        this.events = events;;
      },
      error: (error) =>{
        console.log(error)
      }
    });
  }

/////////////////////////////////////////////////////
    filterByCategory(category: string) {

    this.eventService.geteventByCategory(category).subscribe({
      next: (events) => {
        this.events = events;
     
      },
      error: (error) => {
        console.log(error)
      }
    });
  }

  addToFav(event: EventModel) {
    this.userService.addEventToFav(event._id).subscribe({
      next: (updatedFavs) => {
        console.log('Updated favorite events:', updatedFavs);
        alert(`${event.name} added to favorites!`);
        this.already_added = true
      },
      error: (err) => {
        console.error('Error adding to favorites:', err);
        alert('Failed to add to favorites. Please try again.');
      }
    });
  }
  bookEvent(event: EventModel) {
    this.userService.bookevent(event._id).subscribe({
      next: (ticket) => {
        console.log('Ticket booked:', ticket);
        alert(`Successfully booked ${event.name}! view it in your profile`);
      },
      error: (err) => {
        console.error('Error booking event:', err);
        alert('Failed to book event. Please try again.');
      }
    });
  }

  removefromfav(event: EventModel) {
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

selectedEvent: EventModel | null = null;

seeMore(event: EventModel) {
  this.selectedEvent = event;
}

closeModal() {
  this.selectedEvent = null;
}

searchCategory: string = '';
searchByCategory() {
  const category = this.searchCategory.trim();

  if (!category) {
    this.loadAllEvents();   // if empty, reload all events
    return;
  }

  this.eventService.geteventByCategory(category).subscribe({
    next: (events) => {
      if (events.length === 0) {
        alert(`No events found in category: ${category}`);
      }
      this.events = events;
    },
    error: (error) => {
      console.error(error);
      alert("Something went wrong while searching.");
    }
  });
}




}