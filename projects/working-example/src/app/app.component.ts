import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AsyncModalModule, ModalService } from '@belomonte/async-modal-ngx';
import { MyModalComponent } from './my-modal/my-modal.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    AsyncModalModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  pressed: boolean | null = null;

  constructor(
    private modalService: ModalService,
    private router: Router
  ) { }

  open(): void {
    this.modalService
      .createModal(MyModalComponent)
      //  the data send here will be received in onInjectData method
      .setData({ name: 'user' })
      //  optional, this will close modal when route changes
      .setBindToRoute(this.router)
      //  you can add css classes to modal root
      .setRootCssClasses([
        'my-custom-css-class-for-this-specific-instance',
        'another-class'
      ])
      .build()
      .subscribe({
        next: response => {
          this.pressed = response || null;
          console.info('data received: ', response);
        },
        error: error => console.error(error),
        complete: () => console.info('modal was closed')
      });
  }
}
