import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './pages/main/main.component';
import { UserentryComponent } from './components/userentry/userentry.component';
import { HttpClientModule } from "@angular/common/http";
import { LogHistoryComponent } from './components/log-history/log-history.component'; 
import { FormsModule } from '@angular/forms';
import { ErrorComponent } from './pages/error/error.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    UserentryComponent,
    LogHistoryComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
