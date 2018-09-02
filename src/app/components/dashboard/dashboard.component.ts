import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../../user/user';
import { ItemService } from '../../item/item.service';
import { Item } from '../../item/item';
import { CartItem } from '../../item/cartItem';
import { UserService } from '../../user/user.service';
 
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {
  catalog: Item[];
  cart: CartItem[];  
  user: User;
 
  constructor(
    private userService: UserService,
    private itemService: ItemService,
    private router: Router
  ) { }
 
  ngOnInit() {
    this.user = this.userService.activeUser;
    this.catalog = this.itemService.catalog;
    if(this.user.username === "") {
      this.logout();
      this.changeRoute("login");
    }
    if(this.catalog === undefined) {
      this.getItems();
    }
    if(this.cart === undefined) {
      this.getCart(this.user.username);
    }
    this.cart = this.itemService.cart;
  }
 
  getItems(): void {
    this.itemService.getItems()
      .subscribe(items => {
        this.catalog = items;
      });
  }
 
  getCart(user: string): void {
    this.itemService.getCartForUser(user)
      .subscribe(
        (response) => {
          this.cart = response;
        });
  }

  addToCart(item: Item, quantity: number): void {
    this.itemService.addToCart(this.user.username, item, quantity)
    .subscribe(
      (response) => {
        if(typeof(response) === "number") {
          if(response === 0) {

          }
          else {
            this.localCartAdd(item, quantity);
          }
        }
      }
    );
  }

  localCartAdd(item: Item, quantity: number): void {
    let cartItem = this.cartContains(item);
    if(cartItem !== null ) {
      cartItem.quantity += quantity;
    }
    else {
      this.cart.push(
        {
          item: {
            itemNumber:item.itemNumber,
            cost: item.cost,
            price: item.price,
            description: item.description,
            category: item.category
          },
          quantity: quantity
        } as CartItem
      );
    }
  }

  cartContains(item: Item):CartItem {
    for(let cartItem of this.cart ) {
      if(cartItem.item.itemNumber === item.itemNumber) {
        return cartItem;
      }
    }
    return null;
  }

  getImgPath(item: Item): string {
    return "assets/" + item.description + ".png";
  }

  goToCart(): void {
    this.changeRoute("cart/" + this.user.username);
  }

  goToAccountSettings(): void {

  }

  goTo(menu: string): void {
    if(menu === "Logout") {
      this.logout();
    }
    else if( menu === "Account Settings") {
      this.goToAccountSettings();
    }
  }

  logout(): void {
    this.catalog = undefined;
    this.cart = undefined;
    this.user = undefined;
    this.userService.resetUser();
    this.itemService.resetUser();
    this.changeRoute("login");
  }

  changeRoute(path: string) {
    this.router.navigateByUrl(path);
  }
}