import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { Location } from '@angular/common'

import { UserService } from '../../user/user.service'
import { User } from '../../user/user'

@Component({
  selector: 'app-selected-user',
  templateUrl: './selected-user.component.html',
  styleUrls: ['./selected-user.component.css']
})
export class SelectedUserComponent implements OnInit {

  @Input() selectedUser: User;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private location: Location
  ) { }

  ngOnInit() {
    this.getUsers();
  } 

  getUsers(): void {
    const name = this.route.snapshot.paramMap.get('username');
    this.userService.getUser(name)
      .subscribe(user => this.selectedUser = user);
  }

  save(): void {
    this.userService.updateUser(this.selectedUser)
      .subscribe(() => this.goBack());
  }

  goBack(): void {
    this.location.back();
  }
}
