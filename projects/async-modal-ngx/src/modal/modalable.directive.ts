import { Directive } from '@angular/core';
import { Subject } from 'rxjs';

@Directive()
export abstract class ModalableDirective<EntryType, ReturnType> {

  abstract response: Subject<ReturnType | void>;

  title?: string;

  onInjectData?(data: EntryType): void;

  close(): void {
    this.response.complete();
  }
}
