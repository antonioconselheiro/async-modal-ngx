import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AsyncModalModule, ModalService } from '@belomonte/async-modal-ngx';
import { MyModalComponent } from './my-modal/my-modal.component';

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
      .build();
  }
}
