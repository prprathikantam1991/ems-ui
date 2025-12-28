import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private authService: AuthService) {
    console.log('LoginComponent initialized');
  }

  loginWithGoogle(): void {
    console.log('loginWithGoogle() called');
    try {
      this.authService.login();
    } catch (error: any) {
      console.error('Error in loginWithGoogle:', error);
      alert('Error initiating login. Check console for details.');
    }
  }
}
