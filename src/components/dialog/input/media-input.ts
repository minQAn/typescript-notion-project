import { BaseComponent } from "../../component.js";
import { MediaData } from "../dialog.js";

export class MediaInputComponent extends BaseComponent<HTMLElement> implements MediaData{    
    constructor(){
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

    get title(): string {
        const titleInput = this.element.querySelector('#title')! as HTMLInputElement;
        return titleInput.value;
    }

    get url(): string {
        const urlInput = this.element.querySelector('#url')! as HTMLInputElement;
        return urlInput.value;
    }
}