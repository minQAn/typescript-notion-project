import { BaseComponent } from "../../component.js";
export class MediaInputComponent extends BaseComponent {
    constructor(menu) {
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
        this.photoPlaceholder = {
            title: "이미지 제목을 입력해주세요.",
            url: "https://picsum.photos/500/500",
        };
        this.youtubePlaceholder = {
            title: "유투브 제목을 입력해주세요.",
            url: "https://www.youtube.com/watch?v=ba6A5rg1Q4Q",
        };
        const title = this.element.querySelector('#title');
        title.placeholder = menu === 'photo' ? this.photoPlaceholder.title : menu === 'youtube' ? this.youtubePlaceholder.title : "";
        const url = this.element.querySelector('#url');
        url.value = menu === 'photo' ? this.photoPlaceholder.url : menu === 'youtube' ? this.youtubePlaceholder.url : "";
        url.placeholder = menu === 'photo' ? `ex) ${this.photoPlaceholder.url}` : menu === 'youtube' ? `ex) ${this.youtubePlaceholder.url}` : "";
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
