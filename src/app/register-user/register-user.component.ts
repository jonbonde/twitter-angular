import { Component } from '@angular/core';
import { UsersService } from '../users.service';
import { User } from '../user';
import { Router } from '@angular/router';
import { LocalService } from "../local.service";

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss']
})
export class RegisterUserComponent {
  users: User[] = [];
  response: string = "";

  constructor(private usersService: UsersService, private router: Router, private localStore: LocalService) { }

  ngOnInit(): void {
    this.localStore.clearData();
    this.usersService.logoutCompleted();
  }

  registerNew(username: string, email: string, password: string) {
    this.usersService.registerNew({ username, email, password } as User).subscribe(user => {
      console.log(user);
      this.users.push(user);
      this.response = "Successfully registered " + username + ", you can now login";
      this.router.navigate(['/login']);
    },
    error => {
      this.response = error;
    });
  }
}
