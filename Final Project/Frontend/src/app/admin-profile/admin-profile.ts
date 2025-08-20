import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventModel } from '../models/eventModel';
import { AdminService } from '../services/admin-service';
import { UserService } from '../services/user-service';
import { Usermodel } from '../models/usermodel';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-profile',
  imports: [CommonModule,RouterLink,RouterLinkActive,ReactiveFormsModule,FormsModule],
  templateUrl: './admin-profile.html',
  styleUrl: './admin-profile.css'
})
export class AdminProfile implements OnInit {
  private router = inject(Router)
  private adminService = inject(AdminService);
  private userService = inject(UserService)

   users : any[] = []
  myevents : EventModel[] = []
  events : EventModel[] = []
  

ngOnInit(): void {
  this.loadUsers();
}





  deleteEvent(myevent : EventModel) {
    this.adminService.deleteEvent(myevent._id).subscribe({
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
  loadUsers() {
    this.myevents = []
    this.adminService.getAllusers().subscribe({
      next: (users) => {
        this.users = users; // full info
        console.log("All users loaded:", this.users);
      },
      error: (err) => console.error(err)
    });
  }

  getuserbyId(userId: string = "688f7447211ef734ecb35cba") {
    this.adminService.getuserbyid(userId).subscribe({
      next: (response) => {
        console.log('User details:', response);
      },
      error: (error) => {
        console.error('Error fetching user:', error);
      }
    });
  }


deleteuserbyId(userId: string) {
  console.log('Deleting user with id:', userId); // debug
  this.adminService.deleteuserbyid(userId).subscribe({
    next: (response) => {
      console.log('User deleted:', response);
      alert('User deleted successfully');
      this.loadUsers()

      // Remove from UI
      this.users = this.users.filter(user => user._id !== userId);
    },
    error: (error) => {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  });
}


  getbookedUsers(eventid:string = "688eb2a8e8f23e17ea3023c9"){
    this.adminService.getbookedusers(eventid).subscribe({
      next: (response) => {
        console.log('Booked users for event:', response);
      },
      error: (error) => {
        console.error('Error fetching booked users:', error);
      }
    });
  }
  viewmyevents(){
 
 this.users = []
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

   updateEvent(myevent : EventModel) {
    this.adminService.updateEvent(myevent._id, {name : "updated event"}).subscribe({
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

openUpdateModal(myevent: EventModel) {
  this.selectedEventToUpdate = myevent;

  this.updateForm = new FormGroup({
    name: new FormControl(myevent.name, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
    description: new FormControl(myevent.description, [Validators.required, Validators.minLength(10), Validators.maxLength(500)]),
    datetime: new FormControl(myevent.datetime.split('T')[0], [Validators.required]), // prefill date
    location: new FormControl(myevent.location, [Validators.required]),
    price: new FormControl(myevent.price, [Validators.required, Validators.min(0)]),
    totalseats: new FormControl(myevent.totalseats, [Validators.required, Validators.min(1)]),
    availableseats: new FormControl(myevent.availableseats, [Validators.required, Validators.min(0)]),
    category: new FormControl(myevent.category, [Validators.required]),
  });
}

submitUpdate() {
  if (!this.selectedEventToUpdate || this.updateForm.invalid) return;

  // Prepare updated data
  const updatedData = {
    ...this.updateForm.value,
    datetime: new Date(this.updateForm.value.datetime).toISOString(), 
  };

  console.log("Updating event:", updatedData);

  this.adminService.updateEvent(this.selectedEventToUpdate._id, updatedData)
  .subscribe({
    next: (updatedEventFromBackend: EventModel) => {
      alert("Event updated successfully!");

      const index = this.myevents.findIndex(e => e._id === updatedEventFromBackend._id);
      if (index !== -1) this.myevents[index] = updatedEventFromBackend;

      this.selectedEventToUpdate = null; 
    },
    error: (err) => {
      console.error("Error updating event:", err);
      alert("Failed to update event.");
    }
  });

}


}
