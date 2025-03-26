// Angular import
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/authService';
import { showNotification } from 'src/app/demo/utils/notification';
import { Router } from '@angular/router';
@Component({
  selector: 'app-auth-register',
  imports: [RouterModule,FormsModule],
  templateUrl: './auth-register.component.html',
  styleUrl: './auth-register.component.scss'
})
export class AuthRegisterComponent {
  constructor(private authService: AuthService, private router:Router) {}

  email: string = '';
  password: string = '';
  name: string = '';
  // public method

  signUp() {
    if (!this.email || !this.name || !this.password) {
      showNotification(false, 'Please fill in all fields');
      return;
    }

    this.authService.signUpWithEmail({email:this.email, password:this.password}).subscribe({
      next: (data) => {
        showNotification(true, 'Sign Up successful');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        showNotification(false, 'Failed to Sign Up');
      }
    });
  }

  SignUpOptions = [
    {
      image: 'assets/images/authentication/google.svg',
      name: 'Google'
    },
    {
      image: 'assets/images/authentication/twitter.svg',
      name: 'Twitter'
    },
    {
      image: 'assets/images/authentication/facebook.svg',
      name: 'Facebook'
    }
  ];
}
