import { BaseComponent } from "../../component.js";
export class TodoComponent extends BaseComponent {
    constructor(title, todo) {
        super(`
            <section class="todo">                    
                <h2 class="section-item__title todo__title"></h2>
                <input type="checkbox" id="todo-checkbox"/>
                <label for="todo-checkbox" class="todo-label"></label>                                
            </section>
        `);
        const titleElement = this.element.querySelector('.todo__title');
        titleElement.textContent = title;
        const bodyElement = this.element.querySelector('.todo-label');
        bodyElement.textContent = todo;
    }
}
