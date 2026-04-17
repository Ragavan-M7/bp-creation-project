// src/app/app.component.ts
// Root component - just renders the router outlet
// All page content lives in routed components

import { Component }     from '@angular/core';
import { RouterOutlet }  from '@angular/router';
import { CommonModule }  from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: `<router-outlet></router-outlet>`
})
export class AppComponent {}
