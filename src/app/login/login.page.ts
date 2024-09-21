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
        //const [sUsuario,sNombreUsuario,iIdPerfil,sNombrePerfil,sNroDNI] = response.sDataCabecera.split('|');
        var aCabecera=response.sDataCabecera.split('|');

        const idPerfil = aCabecera[2]; // ID del perfil
        const nombre = aCabecera[1]; // Nombre del usuario
        const perfil =aCabecera[3]; // Perfil del usuario
        const datamenu=response.sDataMenu;

        localStorage.setItem('usuario', this.usuario);
        localStorage.setItem('nombreUsuario', nombre);
        localStorage.setItem('perfilUsuario', perfil);
        localStorage.setItem('idPerfil', idPerfil);
        localStorage.setItem('menuOpciones', datamenu);
        this.navCtrl.navigateRoot('/home');
      },
      (error) => {
        console.error('Login failed', error);
      }
    );
  }
}
