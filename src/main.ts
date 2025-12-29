import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

// Note: Using console.error for bootstrap errors since LoggerService requires Angular DI
// which is not available before the application is bootstrapped
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error('Bootstrap error:', err));
