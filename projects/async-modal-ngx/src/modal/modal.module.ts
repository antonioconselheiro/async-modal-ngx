import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CustomModalComponent } from './custom-modal/custom-modal.component';
import { ModalService } from './modal.service';

@NgModule({
  declarations: [
    CustomModalComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CustomModalComponent
  ],
  providers: [
    ModalService
  ]
})
export class ModalModule { }
