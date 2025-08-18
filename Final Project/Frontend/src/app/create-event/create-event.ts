import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../services/user-service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryValidator } from '../validators/category.validators';

@Component({
  selector: 'app-create-event',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './create-event.html',
  styleUrl: './create-event.css'
})
export class CreateEvent implements OnInit {
  private userservice = inject(UserService);
  eventform!: FormGroup;
  selectedFile : File | null = null;

  ngOnInit(): void {
    this.eventform = new FormGroup({
      name: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]),
      description: new FormControl(null, [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(500)
      ]),
      datetime: new FormControl(null, [
        Validators.required
      ]),
      location: new FormControl(null, [
        Validators.required
      ]),
      price: new FormControl(null, [
        Validators.required,
        Validators.min(0)
      ]),
      totalseats: new FormControl(null, [
        Validators.required,
        Validators.min(1)   // must be at least 1 seat
      ]),
      availableseats: new FormControl(null, [
        Validators.required,
        Validators.min(0)
      ]),
      category: new FormControl('Other', [
        Validators.required
      ]),
      imageurl: new FormControl(null, [
        Validators.pattern(/([^\\s]+(\.(jpg|png|gif|jpeg|webp))$)/i) // optional: must be a valid image URL if provided
      ])
    });
  }

  loading: boolean= false;
  serverError: string = '';


  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.selectedFile = input.files[0];      
    }
  }

    onsubmit() {
    console.log(this.eventform);
    if(this.eventform.invalid){
      this.eventform.markAllAsTouched();
      return;
    }
    const formData = new FormData();
    Object.keys(this.eventform.value).forEach((key) => {
    if (key !== "coverImage") {
      formData.append(key, this.eventform.value[key]);
    }
  });
  if (this.selectedFile) {
    formData.append("coverImage", this.selectedFile);
  }
  this.userservice.createEvent(formData).subscribe({
    next: (event) => {
      console.log("Movie added:", event);
       this.eventform.reset();
      this.selectedFile = null;

    },
    error: (err) => {
      console.error("Error adding movie:", err);
    },
  });
  }


}
