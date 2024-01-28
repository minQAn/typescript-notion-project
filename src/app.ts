import { Composable, MenuComponent } from './components/menu/menu.js';

import { Component } from "./components/component.js";


export type Menu = 'photo' | 'youtube' | 'memo' | 'todo';

class App {
    private readonly menuBox: Component & Composable;

    constructor(appRoot: HTMLElement){
        // Add Menu Box
        const menu = appRoot.querySelector('.menu')! as HTMLElement;        
        this.menuBox = new MenuComponent();
        this.menuBox.attachTo(menu, 'beforeend');
        // Add Menu Items
        this.menuBox.addItem('photo');
        this.menuBox.addItem('youtube');
        this.menuBox.addItem('memo');
        this.menuBox.addItem('todo');

        // Container

    }    
}

new App(document.querySelector('.app')! as HTMLElement);


