import { Component, inject } from '@angular/core';
import { UserService } from '../services/user-service';
import { CommonModule } from '@angular/common';
import { EventModel } from '../models/eventModel';

@Component({
  selector: 'app-user-profile',
  imports: [CommonModule],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css'
})
export class UserProfile {
  private userService = inject(UserService);

  addEventToFav(eventId: string = "688eb2a8e8f23e17ea3023c9") {
    if(!eventId) {
      console.error('Event ID is required to add to favorites.');
      return;
    }
    this.userService.addEventToFav(eventId).subscribe({
      next: (favEvents) => {
        console.log('Favorite events updated:', favEvents);
      },
      error: (error) => {
        console.error('Error adding event to favorites:', error);
      }
    });
  }

  removeEventFromFav(eventid: string = "688eb2a8e8f23e17ea3023c9") {
    this.userService.removeEventFromFav(eventid).subscribe({
      next: (favEvents) => {
        console.log('Favorite events updated after removal:', favEvents);
      },
      error: (error) => {
        console.error('Error removing event from favorites:', error);
      }
    });
  }



  bookEvent(Eventid: string = "689e304a110dfab0e338d508"){
    if(!Eventid) {
      console.error('Event ID is required to book an event.');
      return;
    }
    this.userService.bookevent(Eventid).subscribe({
      next: (ticket) => {
        console.log('Event booked successfully:', ticket);
      },
      error: (error) => {
        console.error('Error booking event:', error);
      }
    })
  }

  cancelBooking(ticketId: string = "689e295a518b4a04daee6f74") {
    this.userService.cancelbooking(ticketId).subscribe({
      next: (response) => {
        console.log('Booking cancelled successfully:', response);
      },
      error: (error) => {
        console.error('Error cancelling booking:', error);
      }
    });
  }
  /////////////////////////////////////////////////////////////////////////
  eventexample1: EventModel = {
  id: "",
  name: "ahmed Music Festival",
  description: "An open-air music festival featuring top bands and DJs.",
  datetime: "2025-08-25T19:00:00.000Z", // ISO date string
  location: "Cairo International Stadium, Egypt",
  price: 350,
  totalseats: 5000,
  availableseats: 2750,
  category: "Music",
  imageurl: "",
  createdby: "", // user ObjectId as string
  createdat: "2025-07-20T14:35:00.000Z",
  bookedusers: [
  ]
};


  ////////////////////////////////////////////////////////



  createevent(eventexample1 : EventModel = this.eventexample1) {
    this.userService.createEvent(eventexample1).subscribe({
      next: (response) => {
        console.log('Event created successfully:', response);
      },
      error: (error) => {
        console.error('Error creating event:', error);
      }
    });
  }

  updateEvent(eventId: string = "689e304a110dfab0e338d508",index :number = 0) {
    this.userService.updateEvent(eventId, {name : "updated event"}).subscribe({
      next: (response) => {
        console.log('Event updated successfully:', response);
      },
      error: (error) => {
        console.error('Error updating event:', error);
      }
    });
  }

  deleteEvent(eventId: string = "689e304a110dfab0e338d508") {
    this.userService.deleteEvent(eventId).subscribe({
      next: (response) => {
        console.log('Event deleted successfully:', response);
      },
      error: (error) => {
        console.error('Error deleting event:', error);
      }
    });
  } 

}
