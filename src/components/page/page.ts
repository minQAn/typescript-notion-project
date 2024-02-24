import { Menu } from "../../app.js";
import { BaseComponent, Component } from "../component.js";
import { Composable } from "../menu/menu.js";

type OnCloseListener = () => void;
type OnDragStateListener<T extends Component> = (target: T, state: DragState) => void;
type DragState = 'start' | 'stop' | 'enter' | 'leave';

export type PageItemContainerConstructor = {
    new(): PageItemContainer;
}

interface ComposableByMenu {
    addItemWithBoxByMenu<T extends PageItemContainerConstructor>(menu: Menu, itemConstructor: T, item: Component): void;       
}

interface PageItemContainer extends Component, Composable {
    setOnCloseListener(listener: OnCloseListener): void;
    setOnDragStateListener(listener: OnDragStateListener<PageItemContainer>): void;
    muteChildren(state: 'mute' | 'unmute'): void;
    getBoundingRect(): DOMRect;
    onDropped(): void;
}

// should be dragable to PageItemSectionComponent
export class PageItemComponent extends BaseComponent<HTMLElement> implements PageItemContainer{
    private onCloseListener?: OnCloseListener;
    private dragStateListener?: OnDragStateListener<PageItemComponent>;
    constructor() {
        super(`
            <li draggable="true" class="page-item">    
                <div class="page-item__controls">
                    <button class="close">&times;</button>
                </div>            
                <section class="page__body"></section>                                
            </li>
        `);                        

        const closeBtn = this.element.querySelector('.close')! as HTMLButtonElement;
        closeBtn.addEventListener('click', () => {
            this.onCloseListener && this.onCloseListener();
        });
        
        // Drag Events
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

    dragStart(_: DragEvent) {
        this.notifyDragObservers('start');
        this.element.classList.add('drag-started');
    }
    dragEnd(_: DragEvent) {
        this.notifyDragObservers('stop');
        this.element.classList.remove('drag-started');
    }
    dragEnter(_: DragEvent) {
        this.notifyDragObservers('enter');
        this.element.classList.add('drop-area');
    }
    dragLeave(_: DragEvent) {
        this.notifyDragObservers('leave');
        this.element.classList.remove('drop-area'); // drop이되면 leave가 발생하지 않고 있음
    }

    notifyDragObservers(state: DragState) {
        this.dragStateListener && this.dragStateListener(this, state);
    }

    setOnDragStateListener(listener: OnDragStateListener<PageItemComponent>) {
        this.dragStateListener = listener;
    }

    muteChildren(state: "mute" | "unmute") {
        if(state === 'mute') {
            this.element.classList.add('mute-children');            
        } else {
            this.element.classList.remove('mute-children');
        }
    }

    getBoundingRect(): DOMRect {
        return this.element.getBoundingClientRect();
    }

    onDropped() {
        this.element.classList.remove('drop-area');
    }

    setOnCloseListener(listener: OnCloseListener) {
        this.onCloseListener = listener;
    }

    addChild(child: Component) {
        const body = this.element.querySelector('.page__body')! as HTMLElement;
        child.attachTo(body);
    }
}

// TODO: 02/11 Drop 재사용성을 위해 section과 ul<droppable>컴포넌트 분할을 해야함

// should be draggable to PageComponent & dropable from PageItemComponent
export class PageItemBoxComponent extends BaseComponent<HTMLUListElement> implements Composable {    
    private children = new Set<PageItemContainer>();
    private dragTarget?: PageItemContainer;
    private dropTarget?: PageItemContainer;

    constructor(private menu: Menu, private pageItemContainer: PageItemContainerConstructor) {
        super(`<ul></ul>`);               
        this.element.classList.add(`${this.menu}__box`);  
        
        this.element.addEventListener('dragover', (event) => {
            this.onDragOver(event);
        });
        this.element.addEventListener('drop', (event) => {
            this.onDrop(event);
        });
        
    }    

    onDragOver(event: DragEvent) {
        event.preventDefault();
    }

    onDrop(event: DragEvent) {
        event.preventDefault();
        console.log('dropTarget: ', this.dropTarget);
        if(!this.dropTarget) {
            return;
        }        
        if(this.dragTarget && this.dragTarget !== this.dropTarget) {
            const dragTargetY = this.dragTarget.getBoundingRect().y;
            const dropY = event.clientY; 
            this.dragTarget.removeFrom(this.element);  
            // console.log('dropY:', dropY);
            // console.log('dragTargetY:', dragTargetY);
            this.dropTarget.attach(this.dragTarget, dragTargetY < dropY ? 'afterend' : 'beforebegin');            
        }

        this.dropTarget.onDropped(); // drop이 발생하면 leave가 발생하지 않아 이곳에서 처리
    }

    
    addChild(section: Component) {
        const pageItemComponent = new this.pageItemContainer();
        pageItemComponent.addChild(section); // new Component(inputComponent);           
        pageItemComponent.attachTo(this.element, 'beforeend'); // add to UL Box
        this.children.add(pageItemComponent);

        pageItemComponent.setOnCloseListener(() => {
            pageItemComponent.removeFrom(this.element);
            this.children.delete(pageItemComponent);

            // remove the page item section if there is nothing
            if(this.element.childElementCount === 0 && this.element.parentElement?.id === this.menu) {                                
                this.element.parentElement.remove();                                
            }             
        });

        // TODO from there.. 드래그 이벤트 구현 시작.. 
        pageItemComponent.setOnDragStateListener((target: PageItemContainer, state: DragState) => {
            switch(state) {
                case 'start':
                    this.dragTarget = target;
                    this.updatePageItems('mute');
                    break;
                case 'stop':
                    this.dragTarget = undefined;
                    this.updatePageItems('unmute');
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

    private updatePageItems(state: 'mute' | 'unmute') {
        this.children.forEach((pageItem: PageItemContainer) => {
            pageItem.muteChildren(state);
        });
    }
}

export class PageSectionComponent extends BaseComponent<HTMLElement> implements ComposableByMenu {
    private pageUlBox?: PageItemBoxComponent;

    constructor(private menu: Menu) {
        super(`
            <section class="page-section">
                <h2 class="page-section-title"></h2>
            </section>
        `);
        
        const pageSectionTitle = this.element.querySelector('.page-section-title')! as HTMLHeadingElement;
        pageSectionTitle.textContent = this.menu.toUpperCase();
        this.element.id = this.menu;              
    }

    addItemWithBoxByMenu<T extends PageItemContainerConstructor>(
        menu: Menu, 
        itemConstructor: T, 
        section: Component, 
    ) {                              
        // When Ul box already exists
        if(this.pageUlBox) {                                    
            this.pageUlBox.addChild(section);
            return;
        }

        const itemUlBox = new PageItemBoxComponent(menu, itemConstructor);                        
        this.pageUlBox = itemUlBox;        
        
        itemUlBox.attachTo(this.element, 'beforeend');              
        itemUlBox.addChild(section);
    }

    get id(): string {
        return this.element.id;
    }
    
}

// should be dropable from PageItemSectionComponent
export class PageComponent extends BaseComponent<HTMLElement> implements Composable{
    constructor() {
        super(`<div class="page"></div>`);        
    }

    addChild(child: Component){        
        child.attachTo(this.element);
    }
}
