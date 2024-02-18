import { Directive, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { AbstractModalableDirective } from './abstract-modalable.directive';
import { IModalMetadata } from './modal-metadata.interface';
import { ModalBuilder } from './modal.builder';

@Directive()
export abstract class ModalDirective implements OnInit, OnDestroy {

  readonly modalInject$ = ModalBuilder.modalInject$;

  isOpen = false;
  content: AbstractModalableDirective<unknown, unknown> | null = null;
  classes: string[] = [];

  private subscriptions = new Subscription();

  abstract container: ViewContainerRef | null;

  ngOnInit(): void {
    this.listenModalInjection();
  }

  private listenModalInjection(): void {
    this.subscriptions.add(
      this.modalInject$.subscribe({
        next: modalMetaData => {
          //  next tick like
          setTimeout(() => {
            this.open();
            this.openModal(modalMetaData);
          })
        }
      }));
  }

  open(): void {
    this.isOpen = true;
  }

  close(): void {
    this.isOpen = false;
  }

  getClasses(classes?: string[]): string {
    classes = classes || [];
    return classes.concat(this.classes).join(' ');
  }

  private openModal(modalMetaData: IModalMetadata<unknown, unknown>): void {
    const container = this.container;
    if (!container) {
      console.error(
        'Impossible to create modal: the this.container attribute ' +
        'is empty, has there been any recent maintenance in the ' +
        'modal part? #modalContainer changed its name?'
      );
      return;
    }

    container.clear();  //  removes old components that were not removed correctly
    const content = this.content = container.createComponent(modalMetaData.component).instance;
    this.classes = modalMetaData.cssClasses;

    if (!content) {
      console.error(`Could not create component ${modalMetaData.component.name} inside modal container.`);
      return;
    }

    content.response = modalMetaData.response;
    if (content.onInjectData) {
      content.onInjectData(modalMetaData.data || null);
    }

    modalMetaData.response.subscribe({
      error: this.closeModal.bind(this),
      complete: this.closeModal.bind(this)
    });
  }

  closeModal(error?: unknown): void {
    const container = this.container;
    if (container) {
      //  next ticking process
      setTimeout(() => {
        container.clear();
        this.close();
        this.content?.response.complete();
      });
    } else {
      console.error(
        'Impossible to create modal this.container, ' +
        'which contains the modal element is empty', error
      );
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
