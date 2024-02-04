import { BaseComponent } from "../../component.js";

export class TodoComponent extends BaseComponent<HTMLElement> {
    constructor(title: string, todo: string) {
        super(`
            <section class="todo__section">                    
                <h2 class="section-item__title todo__title"></h2>
                <input type="checkbox" id="todo-checkbox"/>
                <label for="todo-checkbox" class="todo-label"></label>                                
            </section>
        `);

        const titleElement = this.element.querySelector('.todo__title')! as HTMLHeadingElement;
        titleElement.textContent = title;

        const bodyElement = this.element.querySelector('.todo-label')! as HTMLLabelElement;
        bodyElement.textContent = todo;
    }
}