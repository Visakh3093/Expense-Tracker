import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { authguardGuard } from './guard/authguard.guard';

export const routes: Routes = [
    {
        path:'',
        redirectTo:'login', pathMatch:'full'
    },
    {
        path:'login',
        component:LoginComponent
    },
    {
        path:'register',
        component:RegisterComponent
    },
    {
        path:'dashboard',
        canActivate:[authguardGuard],
        component:DashboardComponent
    },
    {
        path:'**',
        component:PageNotFoundComponent
    }
];
