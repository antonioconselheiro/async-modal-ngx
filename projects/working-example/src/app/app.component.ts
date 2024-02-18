import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AsyncModalModule } from '@belomonte/async-modal-ngx';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    AsyncModalModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'working-example';
}
