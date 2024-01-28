import { BaseComponent } from "../component.js";
export class MenuItemComponent extends BaseComponent {
    constructor(id) {
        super(`
            <li><button class="create-button"></button></li>
        `);
        const createBtn = this.element.querySelector('.create-button');
        createBtn.id = id;
        createBtn.textContent = id;
        createBtn.addEventListener('click', () => {
            this.onClickListener && this.onClickListener();
        });
    }
    setOnClickListener(listener) {
        this.onClickListener = listener;
    }
}
export class MenuComponent extends BaseComponent {
    constructor() {
        super(`<ul class="control-panel"></ul>`);
    }
    addItem(id) {
        const menuItem = new MenuItemComponent(id);
        menuItem.attachTo(this.element);
    }
}
