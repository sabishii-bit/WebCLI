import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './pages/main/main.component';
import { AuthGuard } from './guard/auth.guard';
import { ErrorComponent } from './pages/error/error.component';


const routes: Routes = [
  { path: '', redirectTo: '/terminal', pathMatch: 'full' },
  { path: 'terminal', component: MainComponent, canActivate: [AuthGuard]},
  { path: 'error', component: ErrorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
