import { BaseComponent } from "../../component.js";
export class TextInputComponent extends BaseComponent {
    constructor(menu) {
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
        this.memoPlaceholder = {
            title: "메모 제목을 입력해주세요.",
            body: "메모 내용..",
        };
        this.todoPlaceholder = {
            title: "오늘 할일의 제목을 입력해주세요.",
            body: "오늘 할일 내용..",
        };
        const title = this.element.querySelector('#title');
        title.placeholder = menu === 'memo' ? this.memoPlaceholder.title : menu === 'todo' ? this.todoPlaceholder.title : "";
        const body = this.element.querySelector('#body');
        body.placeholder = menu === 'memo' ? this.memoPlaceholder.body : menu === 'todo' ? this.todoPlaceholder.body : "";
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
