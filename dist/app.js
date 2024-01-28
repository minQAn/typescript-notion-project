import { MenuComponent } from './components/menu/menu.js';
class App {
    constructor(appRoot) {
        const menu = appRoot.querySelector('.menu');
        this.menuBox = new MenuComponent();
        this.menuBox.attachTo(menu, 'beforeend');
        this.menuBox.addItem('photo');
        this.menuBox.addItem('youtube');
        this.menuBox.addItem('memo');
        this.menuBox.addItem('todo');
    }
}
new App(document.querySelector('.app'));
