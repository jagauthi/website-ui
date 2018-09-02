import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../../user/user';
import { UserService } from '../../user/user.service';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  createAccount(name: string, pass: string, email: string): void {
    name = name.trim();
    pass = pass.trim();
    if (!name || !pass) { return; }
    const input = { userId: 0, username: name, password: pass, email: email } as User;
    this.userService.createAccount(input)
      .subscribe(response => {
        this.changeRoute("login");
      });
  }

  changeRoute(path: string) {
    this.router.navigateByUrl(path);
  }

  ngOnInit() {
  }

}
