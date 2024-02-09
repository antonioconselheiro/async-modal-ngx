import { Injectable, Type } from '@angular/core';
import { ModalBuilder } from './modal.builder';
import { ModalableDirective } from './modalable.directive';

@Injectable()
export class ModalService {

  createModal<EntryType, ReturnType>(
    component: Type<ModalableDirective<EntryType, ReturnType>>
  ): ModalBuilder<EntryType, ReturnType> {
    return new ModalBuilder<EntryType, ReturnType>(component);
  }
}
