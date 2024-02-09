import { Subject } from 'rxjs';

export abstract class AbstractModalableDirective<EntryType, ReturnType> {

  abstract response: Subject<ReturnType | void>;

  onInjectData?(data: EntryType): void;

  close(): void {
    this.response.complete();
  }
}
