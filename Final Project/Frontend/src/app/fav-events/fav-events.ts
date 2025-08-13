import { Component, inject } from '@angular/core';
import { UserService } from '../services/user-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fav-events',
  imports: [CommonModule],
  templateUrl: './fav-events.html',
  styleUrl: './fav-events.css'
})
export class FavEvents {
  private userService = inject(UserService);

  addEventToFav(eventId: string = "688eb2a8e8f23e17ea3023c9") {
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

}
