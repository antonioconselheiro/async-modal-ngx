import { Component, EventEmitter, HostBinding, Input, NgZone, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { IModalMetadata } from '../modal-metadata.interface';
import { Observable, Subscription } from 'rxjs';
import { ModalBuilder } from '../modal.builder';
import { ModalableDirective } from '../modalable.directive';

@Component({
  selector: 'modal-outlet',
  templateUrl: './modal-outlet.component.html'
})
export class ModalOutletComponent {

  modalInject$: Observable<IModalMetadata<unknown, unknown>> = ModalBuilder.modalInject$;

  classes: string[] = [];
  isOpen = false;
  content: ModalableDirective<unknown, unknown> | null = null;

  private subscriptions = new Subscription();

  @ViewChild('modalContainer', { read: ViewContainerRef })
  container: ViewContainerRef | null = null;

  @HostBinding('style.display')
  display = 'none';

  /**
   * You can change this to 'block', 'flex'
   * or other css display config
   * 
   * @default 'block'
   */
  @Input()
  showingDisplay: 'block' | 'flex' | string = 'block';

  /**
   * Emits when modal is open
   */
  @Output()
  opened = new EventEmitter<void>();

  /**
   * Emits when modal is closed
   */
  @Output()
  closed = new EventEmitter<void>();

  constructor(
    private ngZone: NgZone
  ) { }

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
    this.ngZone.run(() => {
      this.isOpen = true;
      this.display = this.showingDisplay;
      this.opened.emit();
    });
  }

  close(): void {
    this.ngZone.run(() => {
      this.isOpen = false;
      this.display = 'none'; 
      this.closed.emit();
    });
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
