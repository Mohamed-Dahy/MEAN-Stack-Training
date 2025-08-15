import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventModel } from '../models/eventModel';
import { AdminService } from '../services/admin-service';

@Component({
  selector: 'app-admin-profile',
  imports: [CommonModule],
  templateUrl: './admin-profile.html',
  styleUrl: './admin-profile.css'
})
export class AdminProfile {
  private adminService = inject(AdminService);
  eventexample1: EventModel = {
  id: "",
  name: "admintrial ",
  description: "An open-air music festival featuring top bands and DJs.",
  datetime: "2026-05-25T19:00:00.000Z", // ISO date string
  location: "Cairo International Stadium, Egypt",
  price: 344,
  totalseats: 1111,
  availableseats: 1111,
  category: "Other",
  imageurl: "",
  createdby: "", // user ObjectId as string
  createdat: "2025-07-20T14:35:00.000Z",
  bookedusers: [
  ]
};


    createevent(eventexample1 : EventModel = this.eventexample1) {
    this.adminService.createEvent(eventexample1).subscribe({
      next: (response) => {
        console.log('Event created successfully:', response);
      },
      error: (error) => {
        console.error('Error creating event:', error);
      }
    });
  }

  updateEvent(eventId: string = "689f897174ae766e7138dc2f",index :number = 0) {
    this.adminService.updateEvent(eventId, {name : "updated event  bt idmin"}).subscribe({
      next: (response) => {
        console.log('Event updated successfully:', response);
      },
      error: (error) => {
        console.error('Error updating event:', error);
      }
    });
  }


  deleteEvent(eventId: string = "689f897174ae766e7138dc2f") {
    this.adminService.deleteEvent(eventId).subscribe({
      next: (response) => {
        console.log('Event deleted successfully:', response);
      },
      error: (error) => {
        console.error('Error deleting event:', error);
      }
    });
  } 
  getAllusers() {
    this.adminService.getAllusers().subscribe({
      next: (response) => {
        console.log('All users:', response);
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      }
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
  deleteuserbyId(userId: string = "688f7447211ef734ecb35cba") {
    this.adminService.deleteuserbyid(userId).subscribe({
      next: (response) => {
        console.log('User details:', response);
      },
      error: (error) => {
        console.error('Error fetching user:', error);
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


}
