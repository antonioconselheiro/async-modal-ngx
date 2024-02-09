import { Type } from '@angular/core';
import { Subject } from 'rxjs';
import { AbstractModalableDirective } from './abstract-modalable.directive';

export interface IModalMetadata<EntryType, ReturnType> {
  component: Type<AbstractModalableDirective<EntryType, ReturnType>>;
  response: Subject<ReturnType>;
  cssClasses: string[];
  title?: string;
  data: EntryType;
}
