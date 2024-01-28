import { Menu } from "../../app.js";
import { BaseComponent } from "../component.js";


type OnClickListener = () => void;

export interface Composable {
    addItem(id?: Menu): void;
}

export class MenuItemComponent extends BaseComponent<HTMLElement>{
    private onClickListener?: () => void;

    constructor(id: Menu) {
        super(`
            <li><button class="create-button"></button></li>
        `);

        const createBtn = this.element.querySelector('.create-button')! as HTMLButtonElement;
        createBtn.id = id;
        createBtn.textContent = id; // Text is changed to uppercase from css.        
        createBtn.addEventListener('click', () => {
            this.onClickListener && this.onClickListener();
        });
    }    

    setOnClickListener(listener: OnClickListener) {
        this.onClickListener = listener;
    }
}

export class MenuComponent extends BaseComponent<HTMLElement> implements Composable {
    constructor() {
        super(`<ul class="control-panel"></ul>`);
    }
    
    addItem(id: Menu) {        
        const menuItem = new MenuItemComponent(id);
        menuItem.attachTo(this.element);
        // TODO: have to set listener here menuItem.setList... 

    }
}