import { TextData } from './../dialog.js';
import { BaseComponent } from "../../component.js";

export class TextInputComponent extends BaseComponent<HTMLElement> implements TextData {
    constructor(){
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

    get title(): string {
        const titleInput = this.element.querySelector('#title')! as HTMLInputElement;
        return titleInput.value;
    }

    get body(): string {
        const bodyInput = this.element.querySelector('#body')! as HTMLInputElement;
        return bodyInput.value;
    }
}