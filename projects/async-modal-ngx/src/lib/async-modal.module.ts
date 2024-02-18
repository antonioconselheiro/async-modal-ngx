import { NgModule } from '@angular/core';
import { ModalService } from './modal.service';
import { ModalOutletComponent } from './modal-outlet/modal-outlet.component';

@NgModule({
  declarations: [
    ModalOutletComponent
  ],
  providers: [
    ModalService
  ],
  exports: [
    ModalOutletComponent
  ]
})
export class AsyncModalModule { }
