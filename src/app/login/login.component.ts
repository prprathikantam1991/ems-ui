import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { LoggerService } from '../services/logger.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(
    private authService: AuthService,
    private logger: LoggerService
  ) {
    this.logger.debug('LoginComponent initialized');
  }

  loginWithGoogle(): void {
    this.logger.debug('loginWithGoogle() called');
    try {
      this.authService.login();
    } catch (error: any) {
      this.logger.error('Error in loginWithGoogle', error);
      alert('Error initiating login. Check console for details.');
    }
  }
}
