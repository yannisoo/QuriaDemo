import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArmorComponent } from './components/armor/armor.component';


const routes: Routes = [
  { path: 'armor', component: ArmorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
