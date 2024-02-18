import { Component, HostBinding, ViewChild, ViewContainerRef } from '@angular/core';
import { IModalMetadata } from '../modal-metadata.interface';
import { Observable, Subscription } from 'rxjs';
import { ModalBuilder } from '../modal.builder';
import { AbstractModalableDirective } from '../abstract-modalable.directive';

@Component({
  selector: 'modal-outlet',
  templateUrl: './modal-outlet.component.html'
})
export class ModalOutletComponent {

  modalInject$: Observable<IModalMetadata<unknown, unknown>> = ModalBuilder.modalInject$;

  classes: string[] = [];
  isOpen = false;
  content: AbstractModalableDirective<unknown, unknown> | null = null;

  private subscriptions = new Subscription();

  @ViewChild('modalContainer', { read: ViewContainerRef })
  container: ViewContainerRef | null = null;

  @HostBinding('style.display')
  display = 'none';

  /**
   * You can change this to 'block', 'flex'
   * or other css display config
   */
  protected showingDisplay = 'flex';

  ngOnInit(): void {
    this.listenModalInjection();
  }

  private listenModalInjection(): void {
    this.subscriptions.add(
      this.modalInject$.subscribe({
        next: modalMetaData => {
          //  next ticking
          setTimeout(() =>{
            this.open();
            this.openModal(modalMetaData);
          })
        }
      }));
  }

  open(): void {
    this.isOpen = true;
    this.display = this.showingDisplay;
  }

  close(): void {
    this.isOpen = false;
    this.display = 'none'; 
  }

  getClasses(classes?: string[]): string {
    classes = classes || [];
    return classes.concat(this.classes).join(' ');
  }

  private openModal(modalMetaData: IModalMetadata<unknown, unknown>): void {
    const container = this.container;
    if (!container) {
      console.error(
        'Impossible to create modal: the this.container attribute is empty'
      );
      return;
    }

    container.clear();  //  remove componentes antigos que não foram removidos corretamente
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
      //  next ticking it
      setTimeout(() => {
        container.clear();
        this.close();
        this.content?.response.complete();
      });
    } else {
      console.error('Impossible to create modal: the this.container attribute is empty', error);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
