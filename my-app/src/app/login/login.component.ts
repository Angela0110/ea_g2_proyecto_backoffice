import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { NgIf, NgFor } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  signInForm: FormGroup;
  errorOccurred: boolean = false; 

  constructor(public authService: AuthService, private formBuilder: FormBuilder, private router: Router) {
    this.signInForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
  }

  signIn(): void {
    if (this.signInForm.valid) {
      this.authService.signIn(this.signInForm.value).subscribe(
        (response) => {
          // Redirigir al componente 'users' si la respuesta es satisfactoria
          this.authService.setAuthToken(response.token);
          this.router.navigate(['/users']);
        },
        (error) => {
          this.signInForm.reset();
          this.errorOccurred = true;
          setTimeout(() => {
            this.errorOccurred = false;
          }, 1500);
        }
      );
    } else {
      console.error("El formulario no es válido.");
    }
  }
}

