import { Component } from '@angular/core';
import { ModalableDirective } from '@belomonte/async-modal-ngx';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-my-modal',
  standalone: true,
  templateUrl: './my-modal.component.html',
  styleUrl: './my-modal.component.scss'
})
export class MyModalComponent extends ModalableDirective<{ name: string }, boolean> {

  name!: string;

  override response = new Subject<boolean | void>();
  
  override onInjectData(data: { name: string }): void {
    this.name = data.name;
  }

  ok(): void {
    this.response.next(true);
    //  close method will complete the response observable
    this.close();
  }

  cancel(): void {
    this.response.next(false);
    this.close();
  }
}
