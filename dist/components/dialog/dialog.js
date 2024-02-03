import { BaseComponent } from "../component.js";
export class DialogComponent extends BaseComponent {
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
        const closeBtn = this.element.querySelector('.close');
        closeBtn.addEventListener('click', () => {
            this.onCloseListener && this.onCloseListener();
        });
        const submitBtn = this.element.querySelector('.dialog__submit');
        submitBtn.addEventListener('click', (event) => {
            event.preventDefault();
            this.onSubmitListener && this.onSubmitListener();
        });
    }
    setOnCloseListener(listener) {
        this.onCloseListener = listener;
    }
    setOnSubmitListener(listener) {
        this.onSubmitListener = listener;
    }
    addChild(child) {
        const body = this.element.querySelector('.dialog__body');
        child.attachTo(body);
    }
}
