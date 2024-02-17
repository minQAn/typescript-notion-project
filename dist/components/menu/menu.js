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
        this.pageSectionComponents = [];
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
                if (!this.checkSectionDuplicated(menu)) {
                    const pageSectionComponent = new PageSectionComponent(menu);
                    const section = sectionComponent(inputComponent);
                    this.pageSectionComponents.push(pageSectionComponent);
                    pageSectionComponent.addItemWithBoxByMenu(menu, PageItemComponent, section);
                    pageSectionComponent.attachTo(parent, 'beforeend');
                }
                else {
                    const section = sectionComponent(inputComponent);
                    const currentSection = this.pageSectionComponents.find(section => {
                        if (section.id === menu) {
                            return section;
                        }
                        ;
                    });
                    currentSection.addItemWithBoxByMenu(menu, PageItemComponent, section);
                }
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
    checkSectionDuplicated(id) {
        const checked = this.pageSectionComponents.find(section => {
            if (section.id === id) {
                return true;
            }
        });
        return checked !== undefined ? true : false;
    }
}
