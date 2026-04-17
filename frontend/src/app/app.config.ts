// src/app/app.config.ts
// Standalone Angular 18 app configuration
// Replaces NgModule-based AppModule entirely

import { ApplicationConfig } from '@angular/core';
import { provideRouter }     from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes }            from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient()   // makes HttpClient injectable app-wide
  ]
};
