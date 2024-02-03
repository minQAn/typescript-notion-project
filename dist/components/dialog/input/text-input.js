import { BaseComponent } from "../../component.js";
export class TextInputComponent extends BaseComponent {
    constructor() {
        super(`            
            <div>
                <div class="form__container">
                    <label for="title">Title</label>
                    <input type="text" id="title">
                </div>
                <div class="form__container">
                    <label for="body">Body</label>
                    <textarea id="body" rows=5></textarea>
                </div>
            </div>            
        `);
    }
    get title() {
        const titleInput = this.element.querySelector('#title');
        return titleInput.value;
    }
    get body() {
        const bodyInput = this.element.querySelector('#body');
        return bodyInput.value;
    }
}
