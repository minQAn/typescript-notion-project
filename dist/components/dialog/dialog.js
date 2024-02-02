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
        const dialogForm = this.element.querySelector('.dialog__form');
        dialogForm.addEventListener('submit', (event) => {
            event.preventDefault();
        });
        const closeBtn = this.element.querySelector('.close');
        closeBtn.addEventListener('click', () => {
            this.onCloseListener && this.onCloseListener();
        });
    }
    setOnCloseListener(listener) {
        this.onCloseListener = listener;
    }
}
