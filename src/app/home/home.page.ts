import { Component, OnInit } from '@angular/core';
import { MenuService } from '../menu.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  public appPages: { title: string, url: string }[] = [];

  constructor(private menuService: MenuService) {}

  ngOnInit() {
    console.log("entroo")
    this.appPages = this.menuService.getMenuOptions();
    console.log("entroo")
  }
}
