import { Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { ErrorComponent } from "./error/error.component";

export default [
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    { path: 'login', component: LoginComponent },
    { path: 'error', component: ErrorComponent },
] as Routes;