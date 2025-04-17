import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'; // Correct import for normal components
import { AppModule } from './app/app.module'; // Import your AppModule

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));