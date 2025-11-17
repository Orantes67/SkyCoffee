import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LandingComponent } from "./views/landing/landing.component";
import { LoginComponent } from "./views/login/login.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LandingComponent, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Skycoffee';
}
