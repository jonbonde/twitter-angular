import { Component } from '@angular/core';
import { LocalService } from './local.service';
import { UsersService } from './users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title: string = 'Twitter';
  currentUser: string | null = "";
  isLogedIn: string | null = "false";
  
  constructor(private localStore: LocalService, private usersService: UsersService) {  }

  ngOnInit(): void {
    this.usersService.loginCompleted$.subscribe(() => {
      this.afterLogin();
    });

    this.usersService.logoutCompleted$.subscribe(() => {
      this.afterLogout();
    });

    this.currentUser = this.localStore.getData("currentUser");
    this.isLogedIn = this.localStore.getData("isLogedIn");
  }

  afterLogin(): void {
    this.currentUser = this.localStore.getData("currentUser");
    this.isLogedIn = this.localStore.getData("isLogedIn");
  }

  afterLogout(): void {
    this.localStore.removeData("currentUser");
    this.localStore.removeData("isLogedIn");
    this.currentUser = "";
    this.isLogedIn = "";
  }
}
