import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  menuItems: { name: string, route: string }[] = [];

  constructor(private router: Router) { }

  ngOnInit() {
    const menuOpciones = localStorage.getItem('menuOpciones');
    if (menuOpciones) {
      this.menuItems = menuOpciones.split('¬').map(item => {
        const [name, route] = item.split('|');
        return { name, route };
      });
    }
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}