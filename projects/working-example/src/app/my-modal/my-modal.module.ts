import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyModalComponent } from './my-modal.component';

@NgModule({
  declarations: [
    MyModalComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    MyModalComponent
  ]
})
export class MyModalModule { }
