import { Observable, Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { Component, ComponentFactoryResolver, ViewChild } from "@angular/core";
import { AuthResponseData, AuthService } from './auth.service';
import { Router } from '@angular/router';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';



@Component({
    selector: 'app-auth',
    templateUrl: "./auth.component.html"
})

export class AuthComponent {
    isLoginMode = true;
    isLoading = false;
    error: string = null;
    private closeSub:Subscription
    @ViewChild(PlaceholderDirective, { static: false }) alertHost: PlaceholderDirective;
    constructor(private authService: AuthService, private router: Router, private componentFactoryResolver: ComponentFactoryResolver) { }
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
            this.showErrorAlert(errorMessage);
            console.log(errorMessage);
            // this.error='An Error Occured!'

        });

        form.reset();
    }

    onhandleError() {
        this.error = null;
    }

    private showErrorAlert(message: string) {
        const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
        const hostViewContainerRef = this.alertHost.viewContainerRef;
        hostViewContainerRef.clear();

        const componentRef =  hostViewContainerRef.createComponent(alertCmpFactory);
        componentRef.instance.message = message;
        this.closeSub =  componentRef.instance.close.subscribe(() => {
            this.closeSub.unsubscribe();
            hostViewContainerRef.clear();
            // this.onhandleError();
        });

    }
}