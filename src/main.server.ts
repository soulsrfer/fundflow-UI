// main.server.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';
import { Request, Response } from 'express';
import { REQUEST, RESPONSE } from 'tokens';
import { ApplicationRef, PlatformRef } from '@angular/core';

interface ServerBootstrapContext {
  request?: Request;
  response?: Response;
}

export default function bootstrap(context: ServerBootstrapContext) {
    const { request, response } = context;

  return bootstrapApplication(AppComponent, {
    ...config,
    providers: [
      ...config.providers,
      { provide: RESPONSE, useValue: response }, // <-- manually provide res
      { provide: REQUEST, useValue: request },
    ],
  }, context as any);
}
