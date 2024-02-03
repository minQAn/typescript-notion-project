import { TextData } from './../dialog.js';
import { BaseComponent } from "../../component.js";
import { Menu } from '../../../app.js';

export class TextInputComponent extends BaseComponent<HTMLElement> implements TextData {
    private readonly memoPlaceholder: TextData = {
        title: "메모 제목을 입력해주세요.",
        body: "메모 내용..", 
    }    
    private readonly todoPlaceholder: TextData = {
        title: "오늘 할일의 제목을 입력해주세요.",
        body: "오늘 할일 내용..", 
    } 

    constructor(menu?: Menu){
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

        const title = this.element.querySelector('#title')! as HTMLInputElement;
        title.placeholder = menu === 'memo' ? this.memoPlaceholder.title : menu === 'todo' ? this.todoPlaceholder.title : "";   

        const body = this.element.querySelector('#body')! as HTMLInputElement;
        body.placeholder = menu === 'memo' ? this.memoPlaceholder.body : menu === 'todo' ? this.todoPlaceholder.body : "";   
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