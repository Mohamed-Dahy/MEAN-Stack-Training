import { Component, inject, ViewChild } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { AuthService } from "../services/auth-service";

@Component({
  selector: "app-signup",
  imports: [FormsModule],
  templateUrl: "./signup.html",
  styleUrl: "./signup.css",
})
export class Signup {

 loading = false;
  serverError = "";
  serverSuccess = "";
  selectedFile: File | null = null;
  selectedFileName = "";
  passwordMismatch = false;

  private authService = inject(AuthService);
  @ViewChild("signUpForm") signUpForm!: NgForm;

  onFileSelected(e: Event) {
    console.log(e);

    const input = e.target as HTMLInputElement;

    this.selectedFile = input.files?.[0] || null;
    this.selectedFileName = this.selectedFile?.name || "";
  }

  onSubmit() {
    console.log("server is working")
    if (this.signUpForm.invalid) return;

    const { Firstname, Lastname, username, email, password, confirmpassword } = this.signUpForm.value;
    this.passwordMismatch = password !== confirmpassword;
    if (this.passwordMismatch) return;

    const fd = new FormData();
    fd.append("Firstname",Firstname)
    fd.append("Lastname",Lastname)
    fd.append("username", username);
    fd.append("email", email);
    fd.append("password", password);
    console.log(password);
    fd.append("confirmpassword", confirmpassword);
    console.log(confirmpassword) // should handle in front instead of back
    if (this.selectedFile) fd.append("photo", this.selectedFile);

    this.loading = true;
    this.serverError = "";
    this.serverSuccess = "";

    this.authService.signup(fd).subscribe({
      next: (token) => {
        console.log(token);
        this.loading = false;
        this.serverSuccess = "Account created successfully";
        this.signUpForm.reset();
        this.selectedFile = null;
        this.selectedFileName = "";
      },
      error: (error) => {
        this.loading = false;
        this.serverError = "error.message;"
        console.log(this.serverError)
      },
    });
  }
}