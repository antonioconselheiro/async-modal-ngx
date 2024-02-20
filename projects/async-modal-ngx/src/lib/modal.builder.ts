import { Type } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { filter, first } from 'rxjs/operators';
import { IModalMetadata } from './modal-metadata.interface';
import { ModalableDirective } from './modalable.directive';

export class ModalBuilder<EntryType, ReturnType> {

  private static modalInjectSubject = new Subject<IModalMetadata<unknown, unknown>>();
  static modalInject$ = ModalBuilder.modalInjectSubject.asObservable();

  private injectData: EntryType | null = null;
  private cssClasses: string[] = [];
  private router?: Router;

  private subscription = new Subscription();

  constructor(
    private component: Type<ModalableDirective<EntryType, ReturnType>>
  ) { }

  setData(data: EntryType): ModalBuilder<EntryType, ReturnType> {
    this.injectData = data;
    return this;
  }

  /**
   * Close modal when route change
   */
  setBindToRoute(router: Router): ModalBuilder<EntryType, ReturnType> {
    this.router = router;
    return this;
  }

  setRootCssClasses(classes: string[]): ModalBuilder<EntryType, ReturnType> {
    this.cssClasses = classes;
    return this;
  }

  /**
   * The void type must always be considered as a return, this must occur
   * because when the observable is converted to a promise it will merge
   * the next with the complete and when there is no return from next, due
   * to a forced closure of the modal, the promise will receive a void
   */
  build(): Observable<ReturnType | void> {
    const response = new Subject<ReturnType>();
    const data = this.injectData as unknown;
    const component = this.component as Type<ModalableDirective<unknown, unknown>>;

    if (this.router) {
      //  TODO: validate if query params are ignored or not
      this.subscription.add(this.router.events
        .pipe(filter(nagivation => nagivation instanceof NavigationStart))
        .pipe(first())
        .subscribe(() => {
          if (!response.closed) {
            response.complete();
          }
        }));

      this.subscription.add(response.subscribe({
        complete: () => this.subscription.unsubscribe()
      }));
    } else {
      console.warn(
        `Component "${component.name}" served as modal was not associated with ` +
        `the route and will not be automatically removed if the route is changed`
      );
    }

    ModalBuilder.modalInjectSubject.next({
      component, data,
      cssClasses: this.cssClasses,
      response: response as Subject<unknown>
    });

    return response.asObservable();
  }
}
