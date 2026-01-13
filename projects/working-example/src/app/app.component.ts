
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AsyncModalModule, ModalService } from '@belomonte/async-modal-ngx';
import { MyModalComponent } from './my-modal/my-modal.component';

@Component({
  selector: 'app-root',
  imports: [
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

  open(outletName: string): void {
    this.modalService
      .createModal(MyModalComponent)
      //  the data send here will be received in onInjectData method
      .setData({ name: 'user' })
      //  optional, this will close modal when route changes
      .setBindToRoute(this.router)
      //  choose the modal outlet name, default is 'default'
      .setOutletName(outletName)
      //  you can add css classes to modal root
      .setRootCssClasses([
        'my-custom-css-class-for-this-specific-instance',
        'another-class'
      ])
      .build()
      .subscribe({
        next: response => {
          this.pressed = typeof response === 'boolean' ? response : null;
          console.info('data received: ', response);
        },
        error: error => {
          console.error(error);
        },
        complete: () => {
          console.info('modal was closed');
        }
      });
  }
}
