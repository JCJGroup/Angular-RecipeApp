import { Subscription } from 'rxjs';
import { AuthService } from './../auth/auth.service';
import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { DataStorage } from '../shared/data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  private userSub: Subscription
  isAuthenticated = false;
  constructor(private dataStorageService: DataStorage, private authService: AuthService) {

  }
  ngOnInit() {
    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !user ? false : true;
    });
  }
  onSaveDate() {
    this.dataStorageService.storeRecipes();
  }

  onFetchData() {
    this.dataStorageService.fetechRecipes().subscribe();
  }
  onLogout() {
    this.authService.logout();
  }
  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

}
