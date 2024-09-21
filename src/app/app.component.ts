import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MenuService } from './menu.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public showMenu = false;

  constructor(private router: Router, private menuService: MenuService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showMenu = event.url !== '/login';
      }
    });
  }

  getMenuOptions() {
    return this.menuService.getMenuOptions();
  }

  logout() {
    localStorage.clear();
    this.menuService.setMenuOptions('');  // Limpiar las opciones del menú
    this.router.navigate(['/login']);
  }
}
