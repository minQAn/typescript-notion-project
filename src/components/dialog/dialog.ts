import { BaseComponent } from "../component.js";

type OnCloseListener = () => void;

export class DialogComponent extends BaseComponent<HTMLElement> {
    private onCloseListener?: OnCloseListener;

    constructor() {
        super(`
            <div class="dialog">
                <div class="dialog__container">
                    <form class="dialog__form">                
                        <button type="button" class="close">&times;</button>
                        <div class="dialog__body"></div>
                        <button type="submit" class="dialog__submit">ADD</button>
                    </form>
                </div>                
            </div>
        `);

        // Form
        const dialogForm = this.element.querySelector('.dialog__form')! as HTMLFormElement;
        dialogForm.addEventListener('submit', (event) => {
            event.preventDefault();
        });

        // Close Button
        const closeBtn = this.element.querySelector('.close')! as HTMLButtonElement;
        closeBtn.addEventListener('click', () => {
            this.onCloseListener && this.onCloseListener();            
        });
        
    }
    
    setOnCloseListener(listener: OnCloseListener) {
        this.onCloseListener = listener;
    }
}