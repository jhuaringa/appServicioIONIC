// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable,throwError,BehaviorSubject  } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
 
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:44344/Facturador/EjecutarComando'; // URL base de la API
  //private apiUrl = 'https://joelrogger1-001-site1.htempurl.com/Facturador/EjecutarComando'; // URL base de la API
  private basicAuthUser = '11195376';  // Reemplaza con el usuario de autenticación básica
  private basicAuthPassword = '60-dayfreetrial';  // Reemplaza con la contraseña de autenticación básica

  constructor(private http: HttpClient) {}
  private loggedInSource = new BehaviorSubject<boolean>(false);
  loggedIn$ = this.loggedInSource.asObservable();

  login(usuario: string, password: string): Observable<any> {
    
    const credentials = `${usuario}|${password}`;
    
    // Aquí colocas el cuerpo con los parámetros
    const body = new URLSearchParams();
    body.set('sNombreSP', 'sp_ValidarLogin');       // El valor del parámetro para el stored procedure
    body.set('sNombreParametro', '@Login');                     // Si tienes algún parámetro, lo colocas
    body.set('sValorParametro', credentials);             // Concatenamos usuario y password

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded', // Esto es importante para enviar datos en formato URL-encoded
      'Authorization': 'Basic ' + btoa(`${this.basicAuthUser}:${this.basicAuthPassword}`)
    });

    // Enviamos los datos con un POST
    return this.http.post(this.apiUrl, body.toString(), { headers, responseType: 'text' })
      .pipe(
        map((response: string) => {
          const[sDataCabecera,sDataMenu]=response.split('~');
          this.loggedInSource.next(true);
          return { sDataCabecera,sDataMenu };
        }),
        catchError(this.handleError) // Manejo de errores
      );
  }
  ejecutarComando(nombreProc: string, nombreParametro: string,valorParametro:string): Observable<any> {
    
    
    // Aquí colocas el cuerpo con los parámetros
    const body = new URLSearchParams();
    body.set('sNombreSP', nombreProc);            // El valor del parámetro para el stored procedure
    body.set('sNombreParametro', nombreParametro);// Si tienes algún parámetro, lo colocas
    body.set('sValorParametro', valorParametro);  // Concatenamos usuario y password

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded', // Esto es importante para enviar datos en formato URL-encoded
      'Authorization': 'Basic ' + btoa(`${this.basicAuthUser}:${this.basicAuthPassword}`)
    });

    // Enviamos los datos con un POST
    return this.http.post(this.apiUrl, body.toString(), { headers, responseType: 'text' })
      .pipe(
        map((response: string) => {
          return response
        }),
        catchError(this.handleError) // Manejo de errores
      );
  }
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error inesperado.';

    if (error.error instanceof ErrorEvent) {
      // Errores del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Errores del lado del servidor
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
    }

    // Puedes mostrar el mensaje en la consola o enviar un error al componente
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
