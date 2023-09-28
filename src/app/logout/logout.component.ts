import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalService } from '../local.service';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent {
  constructor(private router: Router, private localStore: LocalService, private usersService: UsersService) {}

  logOut(): void {
    this.localStore.removeData("currentUser");
    this.localStore.removeData("isLogedIn");

    this.router.navigate(['/']);
    this.usersService.logoutCompleted();
  }
}
