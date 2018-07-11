// import { Http } from '@angular/http';
// import { getBaseUrl } from '../getBaseUrl';

// import { HomePage } from '../pages/home/home';

// import { Login } from '../models/login';

// export class AuthService {

//     public username: string;
//     public password: string;
//     public loginModel: Login;

//     // public login: FormGroup;
//     // public submitted: boolean = false;

//     constructor(
//         public getBaseUrl: getBaseUrl,
//         public http: Http) {}

//     login(loginModel: Login) {
//         this.http.post(this.getBaseUrl.getBaseUrl() + "/login", {
//             email: this.loginModel.email,
//             password: this.loginModel.password
//         })
//             .subscribe(
//                 result => {
//                     var Usertoken = result.json();
//                     localStorage.setItem("Token", Usertoken.token);
//                     // this.navCtrl.setRoot(HomePage);
//                     // this.navCtrl.popToRoot();
//                 },
//                 error => {
//                     console.log(error);
//                 }
//             );
//     }
// }