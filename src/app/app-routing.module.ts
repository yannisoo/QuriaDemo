import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArmorComponent } from './components/armor/armor.component';
import { LoginComponent } from './login/login.component';
import { TestComponent } from './test/test.component';

const routes: Routes = [
  { path: 'armor', component: ArmorComponent },
  { path: 'login', component: LoginComponent },
  { path: '', component: TestComponent },


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
