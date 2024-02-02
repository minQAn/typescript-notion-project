import { BaseComponent } from "../component.js";
import { DialogComponent } from "../dialog/dialog.js";
export class MenuItemComponent extends BaseComponent {
    constructor(id) {
        super(`
            <li><button class="create-button"></button></li>
        `);
        const createBtn = this.element.querySelector('.create-button');
        createBtn.id = id;
        createBtn.textContent = id;
        createBtn.addEventListener('click', () => {
            var _a;
            this.onClickListener && this.onClickListener();
            (_a = this.element.getElementsByClassName('create-button').item(0)) === null || _a === void 0 ? void 0 : _a.classList.add('menu-selected');
        });
    }
    setOnClickListener(listener) {
        this.onClickListener = listener;
    }
    muteChild(selectedMenu) {
        var _a;
        if (selectedMenu !== this.element.className) {
            (_a = this.element.getElementsByClassName('menu-selected').item(0)) === null || _a === void 0 ? void 0 : _a.classList.remove('menu-selected');
        }
    }
}
export class MenuComponent extends BaseComponent {
    constructor() {
        super(`<ul class="control-panel"></ul>`);
        this.children = new Set;
    }
    addItem(menu, pageRoot) {
        const menuItem = new MenuItemComponent(menu);
        menuItem.attachTo(this.element);
        this.children.add(menuItem);
        menuItem.setOnClickListener(() => {
            if (this.selectedMenu === menu) {
                return;
            }
            ;
            if (this.currentInputDialog) {
                this.currentInputDialog.removeFrom(pageRoot);
            }
            this.selectedMenu = menu;
            this.updateChildren(this.selectedMenu);
            const dialog = new DialogComponent();
            dialog.attachTo(pageRoot);
            dialog.setOnCloseListener(() => {
                this.selectedMenu = undefined;
                this.currentInputDialog = undefined;
                dialog.removeFrom(pageRoot);
            });
            this.currentInputDialog = dialog;
        });
    }
    updateChildren(selectedMenu) {
        this.children.forEach(menuItem => {
            menuItem.muteChild(selectedMenu);
        });
    }
}