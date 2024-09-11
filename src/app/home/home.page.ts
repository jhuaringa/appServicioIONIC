import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  nombreUsuario: string = '';
  constructor(  private router: Router 
  ) {}
  ngOnInit() {
     // Recupera el nombre del usuario desde localStorage
     this.nombreUsuario = localStorage.getItem('nombreUsuario') || '';
  }
   // Función para cerrar sesión
  logout() {
    localStorage.clear(); // Limpia el localStorage
    this.router.navigate(['/login']); // Redirige al login
  }
  navigateTo(opcion: string) {
    this.router.navigate([`/${opcion}`]);
  }
}
