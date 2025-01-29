> Matthew 5
>
> [43] Ye have heard that it hath been said, Thou shalt love thy neighbour, and hate thine enemy. [44] But I say unto you, Love your enemies, bless them that curse you, do good to them that hate you, and pray for them which despitefully use you, and persecute you; [45] that ye may be the children of your Father which is in heaven: **for he maketh his sun to rise on the evil and on the good, and sendeth rain on the just and on the unjust.**

# Asynchronous Modal for Angular (AsyncModalNgx)

[![npm version](https://badge.fury.io/js/@belomonte%2Fasync-modal-ngx.svg)](https://github.com/antonioconselheiro/async-modal-ngx)
[![Npm Total Downloads](https://img.shields.io/npm/dt/@belomonte/async-modal-ngx.svg)](https://github.com/antonioconselheiro/async-modal-ngx)
[![Npm Monthly Downloads](https://img.shields.io/npm/dm/@belomonte/async-modal-ngx.svg)](https://github.com/antonioconselheiro/async-modal-ngx)


This library will give you the means to present an angular component on the screen with the possibility of sending data to it before rendering and will also provide an observable to receive data from this component and know when the interaction with it has been completed.

This library will not offer you style structures, an appearance for the component that will host your modals must be customized in your project.

## Run example
[Open example app](https://antonioconselheiro.github.io/async-modal-ngx/working-example/browser/)

## Installation

`npm install @belomonte/async-modal-ngx --save`

## How to use

You must import AsyncModalModule where you gonna render <modal-outlet>. You can put it in `AppModule` or you can create a module for a complex and customized modal. 

```typescript
import { AsyncModalModule } from '@belomonte/async-modal-ngx';

@NgModule({
  imports: [
    CommonModule,
    AsyncModalModule
  ]
})
export class AppModule { }
```

To create a modal you must extends ModalableDirective as the example below:

```typescript
import { ModalableDirective } from '@belomonte/async-modal-ngx';

@Component({
  selector: 'app-my-modal',
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
```

After you set <modal-outlet> in your template to render the modal, you can open it like this:

```typescript
import { AsyncModalModule, ModalService } from '@belomonte/async-modal-ngx';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    AsyncModalModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  pressed: boolean | null = null;

  constructor(
    private modalService: ModalService,
    private router: Router
  ) { }

  open(): void {
    this.modalService
      .createModal(MyModalComponent)
      //  the data send here will be received in onInjectData method
      .setData({ name: 'user' })
      //  optional, this will close modal when route changes
      .setBindToRoute(this.router)
      //  you can add css classes to modal root
      .setRootCssClasses([
        'my-custom-css-class-for-this-specific-instance',
        'another-class'
      ])
      .build()
      .subscribe({
        next: response => {
          this.pressed = response || null;
          console.info('data received: ', response);
        },
        error: error => console.error(error),
        complete: () => console.info('modal was closed')
      });
  }
}
```

Also you can open with a small set of configurations:
```typescript
import { AsyncModalModule, ModalService } from '@belomonte/async-modal-ngx';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    AsyncModalModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  pressed: boolean | null = null;

  constructor(
    private modalService: ModalService
  ) { }

  open(): void {
    this.modalService
      .createModal(MyModalComponent)
      .build()
      .subscribe({
        next: response => {
          this.pressed = response || null;
          console.info('data received: ', response);
        }
      });
  }
}
```

## Customize a main modal wrapping ModalOutletComponent
Instead put the <modal-outlet> directly in app.component, you can create a component to work as your main modal and embed each modal component inside it, as the example below:

```typescript
import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ModalBuilder, ModalOutletComponent } from '@belomonte/async-modal-ngx';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main-modal',
  templateUrl: './main-modal.component.html',
  styleUrls: ['./main-modal.component.scss']
})
export class MainModalComponent implements OnInit, OnDestroy {
  
  @ViewChild(ModalOutletComponent)
  modal!: ModalOutletComponent;

  title = '';
  isOpen = false;

  private subscriptions = new Subscription();

  ngOnInit(): void {
    this.subscribeModalData();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  
  private subscribeModalData(): void {
    this.subscriptions.add(ModalBuilder.modalInject$.subscribe({
      next: metadata => {
        //  casting from unknown
        const data = Object(metadata.data);
        if ('title' in data) {
          this.title = data.title;
        }
      }
    }));
  }

  @HostListener('document:keydown.escape')
  close(): void {
    this.modal.close();
  }
}
```

```html
<section [class.hidden]="!isOpen" class="modal">
  <header>
    <button tabindex="1" (click)="close()" type="button">
      x
    </button>
    <h1>{{title}}</h1>
  </header>
  <div>
    <modal-outlet
      name="headedModal"
      (closed)="isOpen = false"
      (opened)="isOpen = true"
      showingDisplay="flex"
    ></modal-outlet>
  </div>
</section>

```

And then you can call it like this:
```typescript
  this.modalService
    .createModal(MainModalComponent)
    .setOutletName('headedModal')
    .build();
```

## CSS Suggestion
You can full customize your modal style, but this is a suggestion from [working example app](https://antonioconselheiro.github.io/async-modal-ngx/working-example/browser/): 

```scss
modal-outlet {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0,0,0,.1);
  border: 1px solid;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 500;

  > * {
    margin: 0 auto;
    display: block;
    min-width: 200px;
    background-color: white;
    border-radius: 15px;
    padding: 1rem;
    box-sizing: border-box;
  }
}

```

## Donate
Help me continue working on tools like this one.
There's still a lot of work to do.

Lighting donate: <a href="lightning:antonioconselheiro@getalby.com">lightning:antonioconselheiro@getalby.com</a>

![zap me](https://raw.githubusercontent.com/antonioconselheiro/antonioconselheiro/main/img/qrcode-wallet-lighting.png)

Bitcoin onchain donate: <a href="bitcoin:bc1qrm99lmmpwk7zsh7njpgthw87yvdm38j2lzpq7q">bc1qrm99lmmpwk7zsh7njpgthw87yvdm38j2lzpq7q</a>

![zap me](https://raw.githubusercontent.com/antonioconselheiro/antonioconselheiro/main/img/qrcode-wallet-bitcoin.png)