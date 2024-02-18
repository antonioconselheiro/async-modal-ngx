import { Subject } from 'rxjs';

/**
 * If you want to render your component in the <modal-outlet>,
 * you must extend this class, and then you can use your
 * component in the builder.
 * 
 * This class will give you the means to receive data sent by
 * the builder, this class will give you the means to respond
 * to the builder through a Subject.
 */
export abstract class ModalableDirective<EntryType, ReturnType> {

  abstract response: Subject<ReturnType | void>;

  onInjectData?(data: EntryType): void;

  close(): void {
    this.response.complete();
  }
}
