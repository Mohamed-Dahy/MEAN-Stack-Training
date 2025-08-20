import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../services/user-service';
import { CommonModule } from '@angular/common';
import { EventModel } from '../models/eventModel';
import { TicketModel } from '../models/ticketModel';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormControl, FormGroup, Validators , ReactiveFormsModule} from '@angular/forms';



@Component({
  selector: 'app-user-profile',
  imports: [CommonModule,RouterLink,RouterLinkActive,ReactiveFormsModule],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css'
})
export class UserProfile implements OnInit {
  private router = inject(Router)
user: any;
  ngOnInit(): void {
    this.viewFavorites() ;
  }
  // for ticket details
  selectedticket :TicketModel | null = null
seeMoreee(ticket: TicketModel) {
this.selectedticket = ticket;
}

closeTicketModal(){
  this.selectedticket = null;
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
// for event details
selectedEvent: EventModel | null = null;

seeMore(event: EventModel) {
  this.selectedEvent = event;
}

closeModal() {
  this.selectedEvent = null;
}
removeFromFav(event: EventModel) {
  this.userService.removeEventFromFav(event._id).subscribe({
    next: (updatedFavs) => {
      console.log(`${event.name} removed from favorites`, updatedFavs);
      alert(`${event.name} removed from favorites!`);

      // Optional: remove the event from your current events array to update the UI
      this.events = this.events.filter(e => e._id !== event._id);
    },
    error: (err) => {
      console.error('Failed to remove event from favorites:', err);
      alert('Failed to remove from favorites. Please try again.');
    }
  });
}

  private userService = inject(UserService);
  events: EventModel[] = [];
  tickets : TicketModel[] = [];
  myevents : EventModel [] = []

  cancelBooking(ticket : TicketModel) {
    this.userService.cancelbooking(ticket._id).subscribe({
      next: (response) => {
        console.log('Booking cancelled successfully:', response);
        alert('Booking cancelled!');
        this.tickets = this.tickets.filter(e => e._id !== ticket._id);
      },
      error: (error) => {
        console.error('Error cancelling booking:', error);
      }
    });
  }
  /////////////////////////////////////////////////////////////////////////


  updateEvent(event : EventModel) {
    this.userService.updateEvent(event._id, {name : "updated event"}).subscribe({
      next: (response) => {
        console.log('Event updated successfully:', response);
      },
      error: (error) => {
        console.error('Error updating event:', error);
      }
    });
  }
  selectedEventToUpdate: EventModel | null = null;
updateForm!: FormGroup;

openUpdateModal(event: EventModel) {
  this.selectedEventToUpdate = event;

  this.updateForm = new FormGroup({
    name: new FormControl(event.name, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
    description: new FormControl(event.description, [Validators.required, Validators.minLength(10), Validators.maxLength(500)]),
    datetime: new FormControl(event.datetime.split('T')[0], [Validators.required]), // prefill date
    location: new FormControl(event.location, [Validators.required]),
    price: new FormControl(event.price, [Validators.required, Validators.min(0)]),
    totalseats: new FormControl(event.totalseats, [Validators.required, Validators.min(1)]),
    availableseats: new FormControl(event.availableseats, [Validators.required, Validators.min(0)]),
    category: new FormControl(event.category, [Validators.required]),
  });
}

submitUpdate() {
  if (!this.selectedEventToUpdate || this.updateForm.invalid) return;

  // Prepare updated data
  const updatedData = {
    ...this.updateForm.value,
    datetime: new Date(this.updateForm.value.datetime).toISOString(), // ensure ISO
  };

  console.log("Updating event:", updatedData);

  this.userService.updateEvent(this.selectedEventToUpdate._id, updatedData)
    .subscribe({
      next: (response: any) => {
        alert("Event updated successfully!");
        this.router.navigateByUrl('/menu')

        // Use the updated event returned from backend
        const updatedEventFromBackend = response.data.event;

        // Update local array
        const index = this.myevents.findIndex(e => e._id === updatedEventFromBackend._id);
        if (index !== -1) this.myevents[index] = updatedEventFromBackend;

        this.selectedEventToUpdate = null; // close modal
      },
      error: (err) => {
        console.error("Error updating event:", err);
        alert("Failed to update event.");
      }
    });
}




  deleteEvent(myevent : EventModel) {
    this.userService.deleteEvent(myevent._id).subscribe({
      next: (response) => {
        console.log('Event deleted successfully:', response);
        alert("Event Deleted successfully")
        this.myevents = this.myevents.filter(e => e._id !== myevent._id);
      },
      error: (error) => {
        console.error('Error deleting event:', error);
      }
    });
  } 


  viewFavorites() {
    this.tickets = []
    this.myevents = []
  this.userService.getfavourites().subscribe({
    next: (event) => {
      this.events = event;
      console.log("Favorite events loaded:", this.events);
    },
    error: (error) => {
      console.error("Error loading favorites:", error);
    }
  });
}

viewtickets(){
  this.events = []
  this.myevents = []
  this.userService.getbookedtickets().subscribe({
    next : (ticket)=>{
      this.tickets = ticket;
      console.log("Booked tickets loaded:", this.tickets);
    },
    error: (error) => {
      console.error("Error loading tickets:", error);
    }
  })
}

viewmyevents() {
  this.tickets = [];
  this.events = []  // clear tickets view
  this.userService.getMyEvents().subscribe({
    next: (myevents) => {
      this.myevents = myevents.events;
      console.log("My events loaded:", this.myevents);
    },
    error: (error) => {
      console.error("Error loading my events:", error);
    }
  });
}



}