import { Component, inject, ViewChild } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { AuthService } from "../services/auth-service";
import { Router } from "@angular/router";
import { CanComponentDeactivate } from "../models/can-component-deactivate.interface";

@Component({
  selector: "app-signup",
  imports: [FormsModule],
  templateUrl: "./signup.html",
  styleUrl: "./signup.css",
})
export class Signup implements CanComponentDeactivate {
  private router = inject(Router);

  loading = false;
  serverError = "";
  serverSuccess = "";
  selectedFile: File | null = null;
  selectedFileName = "";
  passwordMismatch = false;
  hasUnsavedChanges = false;

  private authService = inject(AuthService);
  @ViewChild("signUpForm") signUpForm!: NgForm;


  onInputChange() {
    if (this.signUpForm?.dirty) {
      this.hasUnsavedChanges = true;
    }
  }

  onFileSelected(e: Event) {
    const input = e.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] || null;
    this.selectedFileName = this.selectedFile?.name || "";
    this.hasUnsavedChanges = true; // file selection = change
  }

  onSubmit() {
    if (this.signUpForm.invalid) return;

    const { Firstname, Lastname, username, email, password, confirmpassword } =
      this.signUpForm.value;
    this.passwordMismatch = password !== confirmpassword;
    if (this.passwordMismatch) return;

    const fd = new FormData();
    fd.append("Firstname", Firstname);
    fd.append("Lastname", Lastname);
    fd.append("username", username);
    fd.append("email", email);
    fd.append("password", password);
    fd.append("confirmpassword", confirmpassword);
    if (this.selectedFile) fd.append("photo", this.selectedFile);

    this.loading = true;
    this.serverError = "";
    this.serverSuccess = "";

    this.authService.signup(fd).subscribe({
      next: (token) => {
        this.loading = false;
        this.serverSuccess = "Account created successfully";
        this.signUpForm.reset();
        this.selectedFile = null;
        this.selectedFileName = "";
        this.hasUnsavedChanges = false; 
        this.router.navigate(["/menu"]).then(() => {
          window.location.reload();
        });
      },
      error: (error) => {
        this.loading = false;
        this.serverError = error.message || "Signup failed";
      },
    });
  }
}
