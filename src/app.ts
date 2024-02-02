import { Composable, MenuComponent } from './components/menu/menu.js';

import { Component } from "./components/component.js";
import { PageComponent } from './components/page/page.js';


export type Menu = 'photo' | 'youtube' | 'memo' | 'todo';

class App {
    private readonly menuBox: Component & Composable;
    
    constructor(appRoot: HTMLElement, containerRoot: HTMLElement){
        // Add Menu Box
        const menu = appRoot.querySelector('.menu')! as HTMLElement;        
        this.menuBox = new MenuComponent();
        this.menuBox.attachTo(menu, 'beforeend');
        
        // Add Page        
        const pageComponent = new PageComponent();
        pageComponent.attachTo(containerRoot);   
        // Add Menu Items
        const page = containerRoot.querySelector('.page')! as HTMLElement;
        this.menuBox.addItem('photo', page);
        this.menuBox.addItem('youtube', page);
        this.menuBox.addItem('memo', page);
        this.menuBox.addItem('todo', page);
        
        // Add PageItemSection by clicking menu        
        
    }    
}

new App(document.querySelector('.app')! as HTMLElement, document.querySelector('.container')! as HTMLElement);


