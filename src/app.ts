import { MakeSection, MenuAddable, MenuComponent } from './components/menu/menu.js';

import { Component } from "./components/component.js";
import { PageComponent } from './components/page/page.js';
import { InputComponentConstructor, MediaData, TextData } from './components/dialog/dialog.js';
import { MediaInputComponent } from './components/dialog/input/media-input.js';
import { PhotoComponent } from './components/page/item/photo.js';
import { YoutubeComponent } from './components/page/item/youtube.js';
import { TextInputComponent } from './components/dialog/input/text-input.js';
import { MemoComponent } from './components/page/item/memo.js';
import { TodoComponent } from './components/page/item/todo.js';


export type Menu = 'photo' | 'youtube' | 'memo' | 'todo';

class App {
    private readonly menuBox: Component & MenuAddable;
    
    constructor(appRoot: HTMLElement, containerRoot: HTMLElement){
        // Add Menu Box
        const menu = appRoot.querySelector('.menu')! as HTMLElement;        
        this.menuBox = new MenuComponent();
        this.menuBox.attachTo(menu, 'beforeend');
        
        // Add Page        
        const pageComponent = new PageComponent();
        pageComponent.attachTo(containerRoot);  

        // Root of each Item Content
        const page = containerRoot.querySelector('.page')! as HTMLElement;

        // Photo Button
        this.bindElementToMenu<MediaInputComponent>(
            'photo', 
            MediaInputComponent, 
            (input: MediaInputComponent) => new PhotoComponent(input.title, input.url), 
            page // where to add the created
        );

        // Youbue Button
        this.bindElementToMenu<MediaInputComponent>(
            'youtube',
            MediaInputComponent,
            (input: MediaInputComponent) => new YoutubeComponent(input.title, input.url),
            page
        );

        // Memo Button
        this.bindElementToMenu<TextInputComponent>(
            'memo',
            TextInputComponent,
            (input: TextInputComponent) => new MemoComponent(input.title, input.body),
            page
        );
        
        // Todo Button
        this.bindElementToMenu<TextInputComponent>(
            'todo',
            TextInputComponent,
            (input: TextInputComponent) => new TodoComponent(input.title, input.body),
            page
        );
                  
    }    

    private bindElementToMenu<T extends (MediaData | TextData) & Component>(
        menu: Menu,
        InputConstructor: InputComponentConstructor<T>,
        makeSection: MakeSection<T>,
        parent: HTMLElement
    ) {      
        this.menuBox.addItem(menu, InputConstructor, makeSection, parent); // add menu item
    }
}

new App(document.querySelector('.app')! as HTMLElement, document.querySelector('.container')! as HTMLElement);


