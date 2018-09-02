import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from '../components/message/message.service'
import { Item } from './item';
import { CartItem } from './cartItem';

@Injectable()
export class ItemService {

  private getItemsUrl = "http://localhost:8080/items/getItems";
  private getItemUrl = "http://localhost:8080/items/getItem";
  private addItemsUrl = "http://localhost:8080/items/addItems";
  private addToCartUrl = "http://localhost:8080/items/addToCart";
  private removeFromCartUrl = "http://localhost:8080/items/removeFromCart";
  private getCartForUserUrl = "http://localhost:8080/items/getCartForUser?username=";
  
  private httpOptions = {
    headers: new HttpHeaders(
      { 'Content-Type': 'application/json' }
    )
  };

  public catalog: Item[];
  public cart: CartItem[];

  constructor(
    private http: HttpClient, 
    private messageService: MessageService
  ) { }

  getItems(): Observable<Item[]> {
    this.log(`Fetching items`);
    return this.http.get<Item[]>(this.getItemsUrl)
      .pipe( 
        tap(items => {
          this.log(`Fetched.`);
          this.catalog = items;
        }),
        catchError( this.handleError( 'getItems', [] ) ) 
      );
  }

  getItem(name: string): Observable<Item> {
    this.log(`Fetching item name=${name}`);

    const url = this.getItemUrl + name;
    return this.http.get<Item>(url).pipe(
      tap(_ => this.log(`Fetched item name=${name}`)),
      catchError(this.handleError<Item>(`getItem name=${name}`))
    );
  }

  createItem (item: Item): Observable<number> {
    return this.http.post<number>(this.addItemsUrl, item, this.httpOptions).pipe(
      tap(() => this.log(`Added item: ` + item.description)),
      catchError(this.handleError<number>('createItem'))
    );
  }

  addToCart (username: string, item: Item, quantity: number): Observable<number | Item> {
    const input: Object = 
    {
      username: username,
      cart: [ {
          item: {
            itemNumber:item.itemNumber,
            cost:item.cost,
            price:item.price,
            description:item.description,
            category:item.category
          },
          quantity: quantity
        } ]
    };
    return this.http.post<number>(this.addToCartUrl, input, this.httpOptions).pipe(
      tap(() => {
        this.log(`Added item to cart: ` + item.description);
      }),
      catchError(this.handleError<number>('addToCart'))
    );
  }

  getCartForUser(user: string): Observable<CartItem[]> {
    this.log("Fetching cart for user " + user);
    return this.http.get<CartItem[]>(this.getCartForUserUrl + user)
      .pipe( 
        tap((response) => {
          this.log(`Fetched cart.`);
          this.cart = response;
        }),
        catchError( this.handleError( 'getCartForUser', [] ) ) 
      );
  }

  removeFromCart (username: string, item: Item, quantity: number): Observable<CartItem[]> {
    const input: Object = 
    {
      username: username,
      cart: [ {
          item: {
            itemNumber:item.itemNumber,
            cost:item.cost,
            price:item.price,
            description:item.description,
            category:item.category
          },
          quantity: quantity
        } ]
    };
    return this.http.post<CartItem[]>(this.removeFromCartUrl, input, this.httpOptions).pipe(
      tap((response) => {
        this.log(`Removed item from cart: ` + item.description);
        this.cart = response;
      }),
      catchError(this.handleError<CartItem[]>('removeFromCart'))
    );
  }

  resetUser(): void {
    this.catalog = undefined;
    this.cart = undefined;
  }

  log(message: string): void {
    this.messageService.add("ItemService: " + message);
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: Better error logging
      console.error(error);
      this.log(operation + " + failed: " + error.message);
  
      return of(result as T);
    };
  }
 
}
