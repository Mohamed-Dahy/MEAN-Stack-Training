import { Component, inject, OnInit } from '@angular/core';
import { Eventservice } from '../services/eventsservice'
import { Observable } from 'rxjs';
import { EventModel } from '../models/eventModel';
import { UserService } from '../services/user-service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-event-list',
  imports: [CommonModule],
  templateUrl: './event-list.html',
  styleUrl: './event-list.css'
})
export class EventList  implements OnInit {
  events : Event[] = [];
  private eventservice = inject(Eventservice);

  bookedTickets: any[] = [];

  ngOnInit(): void {
    this.loadevents();
  }
loadevents(){
  this.eventservice.getevents().subscribe({
    next : (data)=>{
      console.log(data)
    }
  });
}


loadeventById(id: string = "689158026edbd9df0f5065d8") {
  this.eventservice.geteventById(id).subscribe({
    next: (data) => {
      console.log(data);
    },
    error: (err) => {
      console.error('Error fetching event by ID:', err);
    }
  });
}

loadeventByCategory(category: string = "Other") {
  this.eventservice.geteventByCategory(category).subscribe({
    next: (data) => {
      console.log(data);
    },
    error: (err) => {
      console.error('Error fetching events by category:', err);
    }
  })
}

}






// addevent(){
//    const newEvent: EventModel = {
//   id: "1",
//   name: "Summer Music Festival 2025",
//   description: "A vibrant outdoor music festival featuring local and international artists, food trucks, and fun activities for all ages.",
//   datetime: "2025-09-15T18:00:00.000Z", // ISO date string
//   location: "Cairo International Stadium",
//   price: 150,
//   totalseats: 5000,
//   availableseats: 5000,
//   category: "Music",
//   imageurl: "https://example.com/images/summer-music-festival.jpg",
//   createdby: "66b89fe8a4d2b12c7f0d4567", // Example creator user ID
//   createdat: new Date().toISOString(),
//   bookedusers: []
// };
//  this.eventservice.addevent(newEvent).subscribe({
//   next : (data)=>{
//     this.events.push(data);
//     console.log(data);
//   }
//  })
// }

