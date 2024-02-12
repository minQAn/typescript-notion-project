import { BaseComponent } from "../component.js";
import { DialogComponent } from "../dialog/dialog.js";
import { PageItemComponent, PageSectionComponent } from '../page/page.js';
export class MenuItemComponent extends BaseComponent {
    constructor(id) {
        super(`
            <li><button class="create-button"></button></li>
        `);
        const createBtn = this.element.querySelector('.create-button');
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
    addItem(menu, InputConstructor, sectionComponent, parent) {
        const menuItem = new MenuItemComponent(menu);
        menuItem.attachTo(this.element, 'beforeend');
        this.children.add(menuItem);
        menuItem.setOnClickListener(() => {
            const container = document.querySelector('.container');
            container.style.overflow = 'hidden';
            if (this.selectedMenu === menu) {
                return;
            }
            ;
            if (this.currentInputDialog) {
                this.currentInputDialog.removeFrom(parent);
            }
            this.selectedMenu = menu;
            this.updateChildren(this.selectedMenu);
            const dialog = new DialogComponent();
            const inputComponent = new InputConstructor(menu);
            dialog.addChild(inputComponent);
            dialog.setOnCloseListener(() => {
                container.style.overflow = 'auto';
                this.initializeMenu();
                dialog.removeFrom(parent);
            });
            dialog.setOnSubmitListener(() => {
                container.style.overflow = 'auto';
                if (!this.checkSectionDuplicated(parent, menu)) {
                    const pageSectionComponent = new PageSectionComponent(menu);
                    pageSectionComponent.addBoxByMenu(menu, PageItemComponent);
                    pageSectionComponent.attachTo(parent, 'beforeend');
                }
                const ulBox = parent.querySelector(`.${menu}__box`);
                const itemComponent = sectionComponent(inputComponent);
                ulBox.addChild(itemComponent);
                this.initializeMenu();
                dialog.removeFrom(parent);
            });
            dialog.attachTo(parent);
            this.currentInputDialog = dialog;
        });
    }
    updateChildren(selectedMenu) {
        this.children.forEach(menuItem => {
            menuItem.muteChild(selectedMenu);
        });
    }
    initializeMenu() {
        this.selectedMenu = undefined;
        this.currentInputDialog = undefined;
        this.updateChildren();
    }
    checkSectionDuplicated(parent, id) {
        return parent.querySelector(`#${id}`) ? true : false;
    }
}
