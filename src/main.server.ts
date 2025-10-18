// main.server.ts
import { bootstrapApplication, BootstrapContext } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';
import { Request, Response } from 'express';
import { REQUEST, RESPONSE } from 'tokens';



export default function bootstrap(request: Request, response: Response) {
  return bootstrapApplication(AppComponent, {
    ...config,
    providers: [
      ...config.providers,
      { provide: RESPONSE, useValue: response }, // <-- manually provide res
      { provide: REQUEST, useValue: request },
    ],
  }, context);
}
