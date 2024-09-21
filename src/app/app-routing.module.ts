import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '',redirectTo: 'login',pathMatch: 'full' },
  { path: 'home',loadChildren: () => import('./home/home.module').then( m => m.HomePageModule) },  
  { path: 'login', loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)  },
  { path: 'personas',loadChildren: () => import('./personas/personas.module').then( m => m.PersonasPageModule)},
  {
    path: 'locales',
    loadChildren: () => import('./locales/locales.module').then( m => m.LocalesPageModule)
  },
  {
    path: 'mapa',
    loadChildren: () => import('./mapa/mapa.module').then( m => m.MapaPageModule)
  },
  {
    path: 'map-modal',
    loadChildren: () => import('./map-modal/map-modal.module').then( m => m.MapModalPageModule)
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
