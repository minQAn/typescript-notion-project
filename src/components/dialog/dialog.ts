import { BaseComponent, Component } from "../component.js";
import { Composable } from "../menu/menu.js";

export type InputComponentConstructor<T extends (MediaData | TextData) & Component> = {
    new(): T;
}

export interface MediaData {
    readonly title: string;
    readonly url: string;
}

export interface  TextData {
    readonly title: string;
    readonly body: string;
}

type OnCloseListener = () => void;
type OnSubmitListener = () => void;

export class DialogComponent extends BaseComponent<HTMLElement> implements Composable{
    private onCloseListener?: OnCloseListener;
    private onSubmitListener?: OnSubmitListener;

    constructor() {
        super(`
            <div class="dialog">
                <div class="dialog__container">
                    <form class="dialog__form" autocomplete="off">                
                        <button type="button" class="close">&times;</button>
                        <div class="dialog__body"></div>
                        <button type="submit" class="dialog__submit">ADD</button>
                    </form>
                </div>                
            </div>
        `);

        // Form
        // const dialogForm = this.element.querySelector('.dialog__form')! as HTMLFormElement;
        // dialogForm.addEventListener('submit', (event) => {
        //     event.preventDefault();
        // });

        // Close Button
        const closeBtn = this.element.querySelector('.close')! as HTMLButtonElement;
        closeBtn.addEventListener('click', () => {
            this.onCloseListener && this.onCloseListener();            
        });

        // Submit Button
        const submitBtn = this.element.querySelector('.dialog__submit')! as HTMLButtonElement;
        submitBtn.addEventListener('click', (event) => {
            event.preventDefault();
            this.onSubmitListener && this.onSubmitListener();
        });
        
    }
    
    setOnCloseListener(listener: OnCloseListener) {
        this.onCloseListener = listener;
    }

    setOnSubmitListener(listener: OnSubmitListener) {
        this.onSubmitListener = listener;
    }

    addChild(child: Component) {
        const body = this.element.querySelector('.dialog__body')! as HTMLElement;        
        child.attachTo(body);                              
    }
    
}