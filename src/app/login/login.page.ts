import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  usuario: string='';
  password: string='';
  constructor(private authService: AuthService,  private navCtrl: NavController ) { }
  
  onLogin() {
    this.authService.login(this.usuario, this.password).subscribe(
      (response) => {         
        const idPerfil = response.iIdPerfil; // ID del perfil
        const nombre = response.nombreUsuario; // Nombre del usuario
        const perfil = response.perfil; // Perfil del usuario
        
        localStorage.setItem('nombreUsuario', nombre);
        localStorage.setItem('perfilUsuario', perfil);
        localStorage.setItem('idPerfil', idPerfil);

        this.navCtrl.navigateRoot('/home');
      },
      (error) => {
        console.error('Login failed', error);
      }
    );
  }
}
