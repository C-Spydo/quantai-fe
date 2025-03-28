// project import
import { Component, OnInit, Renderer2 } from '@angular/core';
import { RouterModule } from '@angular/router';
declare var google: any;
import { environment } from '../../../../../environments/environment';
import { AuthService } from 'src/app/services/authService';
import { showNotification } from 'src/app/demo/utils/notification';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-auth-login',
  imports: [RouterModule, FormsModule],
  templateUrl: './auth-login.component.html',
  styleUrl: './auth-login.component.scss'
})
export class AuthLoginComponent {
  constructor(private renderer: Renderer2, private authService: AuthService, private router:Router) {}

  email: string = '';
  password: string = '';

  ngOnInit() {
    const token = localStorage.getItem('quantai_token');
    if (token) {
      this.router.navigate(['/dashboard']); // Redirect to dashboard
    }
    this.loadGoogleSignInScript();
  }

  loadGoogleSignInScript() {
    const script = this.renderer.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => this.initGoogleSignIn(); // Wait for script to load
    document.body.appendChild(script);
  }


  initGoogleSignIn() {
    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: this.handleCredentialResponse.bind(this)
    });

    google.accounts.id.renderButton(
      document.getElementById('googleSignInBtn'),
      { theme: 'outline', size: 'large' }
    );
  }

  handleCredentialResponse(response: any) {
    const token = response.credential;

    // Decode the JWT token to get user details
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log(payload);
    localStorage.setItem('quantai_google_payload', JSON.stringify(payload));
    const userData = {
      name: payload.name,
      email: payload.email,
      google_id: payload.sub
    };

    this.authService.signIn(userData).subscribe({
      next: (data) => {
        console.log(data);
        localStorage.setItem('quantai_token', data.token);
        localStorage.setItem('quantai_name', data.name);
        localStorage.setItem('quantai_email', data.email);
        localStorage.setItem('quantai_id', data.id);

        showNotification(true, 'Sign In successful');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Error adding prospect:', err);
        showNotification(false, 'Failed to login');
      }
    });
    console.log(userData);
  

  }


  emailSignIn() {
    if (!this.email || !this.password) {
      showNotification(false, 'Please fill in all fields');
      return;
    }

    this.authService.signInWithEmail({email:this.email, password:this.password}).subscribe({
      next: (data) => {
        console.log(data);
        localStorage.setItem('quantai_token', data.token);
        localStorage.setItem('quantai_name', data.name);
        localStorage.setItem('quantai_email', data.email);
        localStorage.setItem('quantai_id', data.id);
        showNotification(true, 'Sign In successful');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Error adding prospect:', err);
        showNotification(false, 'Failed to login');
      }
    });
  }

  SignInOptions = [
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
