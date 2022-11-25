import { Observable } from 'rxjs';
import { NgForm } from '@angular/forms';
import { Component } from "@angular/core";
import { AuthResponseData, AuthService } from './auth.service';
import { Router } from '@angular/router';



@Component({
    selector: 'app-auth',
    templateUrl: "./auth.component.html"
})

export class AuthComponent {
    isLoginMode = true;
    isLoading = false;
    error: string = null;

    constructor(private authService: AuthService, private router:Router) { }
    onSwitch() {
        this.isLoginMode = !this.isLoginMode
    }

    onSubmit(form: NgForm) {

        if (!form.valid) {
            return;
        }
        console.log(form.value);
        const email = form.value.email;
        const password = form.value.password;
        this.isLoading = true;


        let authObs: Observable<AuthResponseData>;

        if (this.isLoginMode) {
            authObs = this.authService.login(email, password)
        } else {
            authObs = this.authService.signup(email, password)

        }

        authObs.subscribe(resData => {
            console.log(resData);
            this.isLoading = false;
            this.router.navigate(['/recipes']);
        }, errorMessage => {
            this.isLoading = false;
            this.error = errorMessage
            console.log(errorMessage);
            // this.error='An Error Occured!'

        });

        form.reset();
    }
}