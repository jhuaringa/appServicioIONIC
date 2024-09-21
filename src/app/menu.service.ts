import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private appPages: { title: string, url: string }[] = [];

  constructor() {
    this.loadMenuOptions();
  }

  private loadMenuOptions() {
    const menuData = localStorage.getItem('menuOpciones');
    if (menuData) {
      this.appPages = menuData.split('¬').map(item => {
        const [title, url] = item.split('|');
        return { title: title.trim(), url: url.trim() };
      });
    }
  }

  getMenuOptions() {
    this.loadMenuOptions();
    return this.appPages;    
  }

  setMenuOptions(menuData: string) {
    localStorage.setItem('menuOpciones', menuData);
    this.loadMenuOptions();  // Actualizar el menú en el servicio
  }
}
