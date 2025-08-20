import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../services/user-service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { CanComponentDeactivate } from '../models/can-component-deactivate.interface';

@Component({
  selector: 'app-create-event',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './create-event.html',
  styleUrl: './create-event.css'
})
export class CreateEvent implements OnInit, CanComponentDeactivate {

  private router = inject(Router);
  private userservice = inject(UserService);

  eventform!: FormGroup;
  selectedFile: File | null = null;
  hasUnsavedChanges = false;
  loading: boolean = false;
  serverError: string = '';

  ngOnInit(): void {
    this.eventform = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
      description: new FormControl(null, [Validators.required, Validators.minLength(10), Validators.maxLength(500)]),
      datetime: new FormControl(null, [Validators.required]),
      location: new FormControl(null, [Validators.required]),
      price: new FormControl(null, [Validators.required, Validators.min(0)]),
      totalseats: new FormControl(null, [Validators.required, Validators.min(1)]),
      availableseats: new FormControl(null, [Validators.required, Validators.min(0)]),
      category: new FormControl('Other', [Validators.required]),
      imageurl: new FormControl(null, [Validators.pattern(/([^\\s]+(\.(jpg|png|gif|jpeg|webp))$)/i)])
    });

    // Track form changes for unsaved changes guard
    this.eventform.valueChanges.subscribe(() => {
      this.hasUnsavedChanges = true;
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.selectedFile = input.files[0];      
      this.hasUnsavedChanges = true; // mark unsaved changes
    }
  }

  onsubmit() {
    if (this.eventform.invalid) {
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

    this.loading = true;
    this.userservice.createEvent(formData).subscribe({
      next: (event) => {
        this.loading = false;
        this.eventform.reset();
        this.selectedFile = null;
        this.hasUnsavedChanges = false; // clear unsaved changes
        alert("Event Created Successfully");
        this.router.navigate(['/menu']).then(() => window.location.reload());
      },
      error: (err) => {
        this.loading = false;
        console.error("Error adding event:", err);
        this.serverError = "Failed to create event.";
      }
    });
  }

  // CanDeactivate method
  canDeactivate(): boolean {
    return this.hasUnsavedChanges ? window.confirm("Discard changes?") : true;
  }
}
