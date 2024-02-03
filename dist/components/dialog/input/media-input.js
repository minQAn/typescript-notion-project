import { BaseComponent } from "../../component.js";
export class MediaInputComponent extends BaseComponent {
    constructor() {
        super(`            
            <div>
                <div class="form__container">
                    <label for="title">Title</label>
                    <input type="text" id="title">
                </div>
                <div class="form__container">
                    <label for="url">URL</label>
                    <input type="text" id="url">
                </div>
            </div>            
        `);
    }
    get title() {
        const titleInput = this.element.querySelector('#title');
        return titleInput.value;
    }
    get url() {
        const urlInput = this.element.querySelector('#url');
        return urlInput.value;
    }
}
