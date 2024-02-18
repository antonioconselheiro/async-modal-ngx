import { Component } from '@angular/core';
import { AbstractModalableDirective } from '@belomonte/async-modal-ngx';

@Component({
  selector: 'app-my-modal',
  templateUrl: './my-modal.component.html',
  styleUrl: './my-modal.component.scss'
})
export class MyModalComponent extends AbstractModalableDirective {

}
