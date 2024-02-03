import { Menu } from "../../../app.js";
import { BaseComponent } from "../../component.js";
import { MediaData } from "../dialog.js";

export class MediaInputComponent extends BaseComponent<HTMLElement> implements MediaData{        
    private readonly photoPlaceholder: MediaData = {
        title: "이미지 제목을 입력해주세요.",
        url: "https://picsum.photos/500/500", // Mock Data to test 
    }    
    private readonly youtubePlaceholder: MediaData = {
        title: "유투브 제목을 입력해주세요.",
        url: "https://www.youtube.com/watch?v=ba6A5rg1Q4Q", // Mock Data to test
    } 

    constructor(menu?: Menu){
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

        const title = this.element.querySelector('#title')! as HTMLInputElement;
        title.placeholder = menu === 'photo' ? this.photoPlaceholder.title : menu === 'youtube' ? this.youtubePlaceholder.title : "";        

        const url = this.element.querySelector('#url')! as HTMLInputElement;
        url.value = menu === 'photo' ? this.photoPlaceholder.url : menu === 'youtube' ? this.youtubePlaceholder.url : "";
        url.placeholder = menu === 'photo' ? `ex) ${this.photoPlaceholder.url}` : menu === 'youtube' ? `ex) ${this.youtubePlaceholder.url}` : "";
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