import { Component } from '@angular/core';
import { UsersService } from '../users.service';
import { User } from '../user';
import { Router } from '@angular/router';
import { LocalService } from '../local.service';

@Component({
  selector: 'app-login-user',
  templateUrl: './login-user.component.html',
  styleUrls: ['./login-user.component.scss']
})
export class LoginUserComponent {
  users!: User[];
  response!: string;

  constructor(private usersService: UsersService, private router: Router, private localStore: LocalService) { }

  ngOnInit(): void {
    this.localStore.clearData();
    this.usersService.logoutCompleted();
  }

  login(username: string, password: string): void {
    this.usersService.login(username, password).subscribe(isSuccess => {
      if (isSuccess) {

        this.localStore.saveData("isLogedIn", "true");
        this.localStore.saveData("currentUser", username);

        this.router.navigate(['/account', username]);
        this.usersService.loginCompleted();
      } else {
        this.response = "Wrong username or password!!!";
      }
    });
  }
}
