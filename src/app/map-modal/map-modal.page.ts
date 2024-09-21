import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as L from 'leaflet';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.page.html',
  styleUrls: ['./map-modal.page.scss'],
})
export class MapModalPage implements OnInit {
  private map: L.Map | undefined;
  private marker: L.Marker | undefined;
  private currentLocation: L.LatLng | undefined;

  constructor(private modalCtrl: ModalController) { }

  async ngOnInit() {
    this.initMap();
    await this.loadCurrentLocation();
  }

  private initMap() {
    this.map = L.map('map', {
      renderer: L.canvas() // Habilitar renderización en GPU
    }).setView([0, 0], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.marker = L.marker([0, 0], { draggable: true }).addTo(this.map);
    this.marker.on('moveend', (event: L.LeafletEvent) => {
      const position = (event.target as L.Marker).getLatLng();
      console.log(`Marker moved to: Latitude: ${position.lat}, Longitude: ${position.lng}`);
    });
  }

  private async loadCurrentLocation() {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      const lat = coordinates.coords.latitude;
      const lng = coordinates.coords.longitude;
      alert(`Latitude: ${lat}, Longitude: ${lng}`);
      if (this.map && this.marker) {
        this.currentLocation = L.latLng(lat, lng);
        this.map.setView(this.currentLocation, 13);
        this.marker.setLatLng(this.currentLocation);
      }
    } catch (error) {
      console.error('Error getting location', error);
    }
  }

  async saveLocation() {
    if (this.marker) {
      const position = this.marker.getLatLng();
      const lat = position.lat.toFixed(6);
      const lng = position.lng.toFixed(6);

      await this.modalCtrl.dismiss({
        lat: lat,
        lng: lng
      });
    }
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}
