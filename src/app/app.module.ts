import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { SelectedUserComponent } from './components/selected-user/selected-user.component';
import { UserService } from './user/user.service';
import { ItemService } from './item/item.service';
import { MessageComponent } from './components/message/message.component'
import { MessageService } from './components/message/message.service';
import { AppRoutingModule } from './/app-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CreateAccountComponent } from './components/create-account/create-account.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SelectedUserComponent,
    MessageComponent,
    DashboardComponent,
    CreateAccountComponent,
    CartComponent,
    CheckoutComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [
    UserService,
    ItemService,
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
