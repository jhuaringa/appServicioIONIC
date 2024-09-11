// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:44344/Facturador/EjecutarComando'; // URL base de la API

  constructor(private http: HttpClient) {}

  login(usuario: string, password: string): Observable<any> {
    const credentials = `${usuario}|${password}`;
    
    // Aquí colocas el cuerpo con los parámetros
    const body = new URLSearchParams();
    body.set('sNombreSP', 'sp_ValidarLogin');       // El valor del parámetro para el stored procedure
    body.set('sNombreParametro', '@Login');                     // Si tienes algún parámetro, lo colocas
    body.set('sValorParametro', credentials);             // Concatenamos usuario y password

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded' // Esto es importante para enviar datos en formato URL-encoded
    });

    // Enviamos los datos con un POST
    return this.http.post(this.apiUrl, body.toString(), { headers, responseType: 'text' })
      .pipe(
        map((response: string) => {
          const [usuario,password,iIdPerfil,nombreUsuario, perfil, b64logo] = response.split('|');
          return { iIdPerfil,nombreUsuario, perfil };
        })
      );
  }
}
