import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { AlertController,NavController,ModalController  } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { Router } from '@angular/router';
import { MapModalPage } from '../map-modal/map-modal.page';

@Component({
  selector: 'app-locales',
  templateUrl: './locales.page.html',
  styleUrls: ['./locales.page.scss'],
})
export class LocalesPage implements OnInit {  
  public locales: any[] = [];
  public mostrarFormulario: boolean = false;
  public localSeleccionado: any = null;
  public sLongitud :string="";
  public sLatitud :string="";
  ubicacion: string = '';
  public sUsuarioAud: string = '';
  constructor(private authService: AuthService,private alertController: AlertController,
    private navCtrl: NavController, private router: Router,private modalCtrl: ModalController) { 
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.ubicacion = navigation.extras.state['ubicacion'];    
    }
  }

  ngOnInit() {
    this.sUsuarioAud= localStorage.getItem('usuario')|| ''    
  }
  ionViewWillEnter() {
    this.loadLocales();
    this.obtenerUbicacion()
    
  }
  // Método para cargar los datos de los locales
  loadLocales() {
    let nombreProc='sp_ListaEstablecimiento'
    let nombrePara=''
    let valorPara=''
    this.authService.ejecutarComando(nombreProc, nombrePara,valorPara).subscribe(
      (response) => {
        const filas = response.split('¬');
        // 2. Crear el array de objetos locales
        const locales = filas.map((fila: string) => {
        const valores = fila.split('|');
        return {
            iIdEstablecimiento: Number(valores[0]),
            Nombre: valores[1],
            Direccion: valores[2],
            Telefono: valores[3],
            HoraInicio: valores[4],
            HoraFin: valores[5],
            Ubicacion: valores[6] ,
            Descripcion: valores[7] 
        };
      });        
        // Asignar el resultado a this.locales
        this.locales = locales;
      },
      (error) => {     
        this.mostrarMensaje(error, '-1');   
      }
    );
  }
  eliminarLocal(local: any){
    this.localSeleccionado = local ? { ...local } : { iIdEstablecimiento: null, Nombre: '', Direccion: '', Telefono: '', HoraInicio: '', HoraFin: '', Ubicacion: '', Descripcion: '' };
    let sData=
      this.localSeleccionado.iIdEstablecimiento
      +"|"+ this.sUsuarioAud     
    this.authService.ejecutarComando("sp_EliminarEstablecimiento","@vData",sData).subscribe(
      (response) => {
        this.procesarRespuestaApi(response);       
      },
      (error) => {
        this.mostrarMensaje(error, '-1'); 
      }
    );
  }
  // Método para mostrar el formulario de registro o edición
  registrarEditarLocal(local: any) {
    this.localSeleccionado = local ? { ...local } : { iIdEstablecimiento: null, Nombre: '', Direccion: '', Telefono: '', HoraInicio: '', HoraFin: '', Ubicacion: '', Descripcion: '' };
    this.mostrarFormulario = true; // Muestra el formulario y oculta la lista
    this.localSeleccionado.Ubicacion=this.sLongitud+","+this.sLatitud
  }
  // Método para cancelar el registro o edición
  cancelar() {
    this.mostrarFormulario = false; // Oculta el formulario y muestra la lista
  }

  // Método para guardar el local (puedes hacer la lógica para crear o actualizar)
  guardarLocal() {
    let sData=""
    if (this.localSeleccionado.iIdEstablecimiento) {
      // Lógica para actualizar el local existente
      const index = this.locales.findIndex(l => l.iIdEstablecimiento === this.localSeleccionado.iIdEstablecimiento);
      if (index > -1) {
        this.locales[index] = this.localSeleccionado;
      }      
    } else {
      // Lógica para registrar un nuevo local
      this.localSeleccionado.iIdEstablecimiento = 0;
      this.locales.push(this.localSeleccionado);
    }    
    sData=
      this.localSeleccionado.iIdEstablecimiento
      +"|"+this.localSeleccionado.Nombre
      +"|"+this.localSeleccionado.Direccion
      +"|"+this.localSeleccionado.Telefono
      +"|"+this.localSeleccionado.HoraInicio
      +"|"+this.localSeleccionado.HoraFin
      +"|"+this.localSeleccionado.Ubicacion
      +"|"+this.localSeleccionado.Descripcion
      +"|"+this.sUsuarioAud
    this.authService.ejecutarComando("sp_MantenimientoEstablecimiento","@vData",sData).subscribe(
      (response) => {
        this.procesarRespuestaApi(response);
        
      },
      (error) => {
        this.mostrarMensaje('Ocurrió un error al guardar el local. Por favor, intenta nuevamente.', '-1');      
      }
    );    
  }

  procesarRespuestaApi(respuesta: string) {
    // Dividimos la respuesta en código (1 o -1) y mensaje
    const [codigo, mensaje] = respuesta.split('~');

    // Mostrar el mensaje en un alert y ejecutar una acción según el código
    this.mostrarMensaje(mensaje, codigo);
  }
  // Método para mostrar el mensaje y ejecutar la acción si es exitoso
  async mostrarMensaje(mensaje: string, codigo: string) {
    const alert = await this.alertController.create({
      header: 'Resultado',
      message: mensaje,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            // Si el código es 1, ejecuta una acción adicional
            if (codigo === '1') {             
              this.loadLocales();  // Recargar la lista de locales
              this.mostrarFormulario = false; // Ocultar el formulario después de confirmar
            } else {
              this.mostrarMensaje(mensaje, '-1'); 
            }
          }
        }
      ]
    });
    await alert.present();
  }
  async obtenerUbicacion() {
    const coordinates = await Geolocation.getCurrentPosition();
    const lat = coordinates.coords.latitude;
    const lon = coordinates.coords.longitude;
    this.sLongitud=lon.toString();
    this.sLatitud=lat.toString();
  }
  
  async openMapModal() {
    const modal = await this.modalCtrl.create({
      component: MapModalPage
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        const { lat, lng } = result.data;
        this.sLatitud = lat.toString();
        this.sLongitud = lng.toString();
      }
    });

    return await modal.present();
  }
}
