import { BaseComponent } from "../component.js";
export class PageItemComponent extends BaseComponent {
    constructor() {
        super(`
            <li draggable="true" class="page-item">    
                <div class="page-item__controls">
                    <button class="close">&times;</button>
                </div>            
                <section class="page__body"></section>                                
            </li>
        `);
        const closeBtn = this.element.querySelector('.close');
        closeBtn.addEventListener('click', () => {
            this.onCloseListener && this.onCloseListener();
        });
        this.element.addEventListener('dragstart', (event) => {
            this.dragStart(event);
        });
        this.element.addEventListener('dragend', (event) => {
            this.dragEnd(event);
        });
        this.element.addEventListener('dragenter', (event) => {
            this.dragEnter(event);
        });
        this.element.addEventListener('dragleave', (event) => {
            this.dragLeave(event);
        });
    }
    dragStart(_) {
        this.notifyDragObservers('start');
    }
    dragEnd(_) {
        this.notifyDragObservers('stop');
    }
    dragEnter(_) {
        this.notifyDragObservers('enter');
    }
    dragLeave(_) {
        this.notifyDragObservers('leave');
    }
    notifyDragObservers(state) {
        this.dragStateListener && this.dragStateListener(this, state);
    }
    setOnDragStateListener(listener) {
        this.dragStateListener = listener;
    }
    muteChildren(state) {
        if (state === 'mute') {
            this.element.classList.add('mute-children');
        }
        else {
            this.element.classList.remove('mute-children');
        }
    }
    getBoundingRect() {
        return this.element.getBoundingClientRect();
    }
    setOnCloseListener(listener) {
        this.onCloseListener = listener;
    }
    addChild(child) {
        const body = this.element.querySelector('.page__body');
        child.attachTo(body);
    }
}
export class PageItemBoxComponent extends BaseComponent {
    constructor(menu, pageItemContainer) {
        super(`<ul></ul>`);
        this.menu = menu;
        this.pageItemContainer = pageItemContainer;
        this.children = new Set();
        this.element.classList.add(`${this.menu}__box`);
        this.element.addEventListener('dragover', (event) => {
            this.onDragOver(event);
        });
        this.element.addEventListener('drop', (event) => {
            this.onDrop(event);
        });
    }
    onDragOver(event) {
        event.preventDefault();
    }
    onDrop(event) {
        event.preventDefault();
        if (!this.dropTarget) {
            return;
        }
        if (this.dragTarget && this.dragTarget !== this.dropTarget) {
            const dragTargetY = this.dragTarget.getBoundingRect().y;
            const dropY = event.clientY;
            this.dragTarget.removeFrom(this.element);
            this.dropTarget.attach(this.dragTarget, dragTargetY < dropY ? 'afterend' : 'beforebegin');
        }
    }
    addChild(section) {
        const pageItemComponent = new this.pageItemContainer();
        pageItemComponent.addChild(section);
        pageItemComponent.attachTo(this.element, 'beforeend');
        this.children.add(pageItemComponent);
        pageItemComponent.setOnCloseListener(() => {
            var _a;
            pageItemComponent.removeFrom(this.element);
            this.children.delete(pageItemComponent);
            if (this.element.childElementCount === 0 && ((_a = this.element.parentElement) === null || _a === void 0 ? void 0 : _a.id) === this.menu) {
                this.element.parentElement.remove();
            }
        });
        pageItemComponent.setOnDragStateListener((target, state) => {
            switch (state) {
                case 'start':
                    this.dragTarget = target;
                    this.updateUlBox('mute');
                    break;
                case 'stop':
                    this.updateUlBox('unmute');
                    this.dragTarget = undefined;
                    break;
                case 'enter':
                    this.dropTarget = target;
                    break;
                case 'leave':
                    this.dropTarget = undefined;
                    break;
                default:
                    return new Error(`unsupported state: ${state}`);
            }
        });
    }
    updateUlBox(state) {
        this.children.forEach((pageItem) => {
            pageItem.muteChildren(state);
        });
    }
}
export class PageSectionComponent extends BaseComponent {
    constructor(menu) {
        super(`
            <section class="page-section">
                <h2 class="page-section-title"></h2>
            </section>
        `);
        this.menu = menu;
        const pageSectionTitle = this.element.querySelector('.page-section-title');
        pageSectionTitle.textContent = this.menu.toUpperCase();
        this.element.id = this.menu;
    }
    addItemWithBoxByMenu(menu, itemConstructor, section) {
        if (this.pageUlBox) {
            this.pageUlBox.addChild(section);
            return;
        }
        const itemUlBox = new PageItemBoxComponent(menu, itemConstructor);
        this.pageUlBox = itemUlBox;
        itemUlBox.attachTo(this.element, 'beforeend');
        itemUlBox.addChild(section);
    }
    get id() {
        return this.element.id;
    }
}
export class PageComponent extends BaseComponent {
    constructor() {
        super(`<div class="page"></div>`);
    }
    addChild(child) {
        child.attachTo(this.element);
    }
}
