// src/main.ts
// Angular application bootstrap entry point
// Standalone API: no NgModule needed

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent }         from './app/app.component';
import { appConfig }            from './app/app.config';

bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));
