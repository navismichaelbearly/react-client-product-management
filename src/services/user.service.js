import axios from "axios";
import { BehaviorSubject } from 'rxjs';

const API_URL = 'http://localhost:8080/api/user/';
//const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));
var currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));

class UserService {
    get currentUserValue() {
        return currentUserSubject.value;
    }

    get currentUser() {
        return currentUserSubject.asObservable();
    }

    login(user) {
        console.log("--startlog---");
        console.log(user);
        console.log(user.username);
        console.log(user.password);
        console.log("--endlog---");
        /*
        const headers_backup = {
            authorization: 'Basic ' + btoa(user.username + ':' + user.password)  
        };
        */

        const headers = {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: 'Basic ' + btoa(user.username + ':' + user.password),
        }

        return axios.get(API_URL + 'login', {headers: headers})
            .then(response => {
                localStorage.setItem('currentUser', JSON.stringify(response.data));
                currentUserSubject.next(response.data);
            });
    }

    logout() {
        return axios.post(API_URL + "logout", {})
            .then(response => {
                localStorage.removeItem('currentUser');
                currentUserSubject.next(null);
            });
    }

    register(user) {
        return axios.post(API_URL + 'registration', JSON.stringify(user),
            {headers: {"Content-Type": "application/json; charset=UTF-8"}}
        );
    }

    findAllProducts() {
        return axios.get(API_URL + "products",
            {headers: {"Content-Type" : "application/json; charset=UTF-8"}}
        );
    }

    purchaseProducts(transaction) {
        return axios.post( API_URL + "purchase",  JSON.stringify(transaction),
            {headers: {"Content-Type" : "application/json; charset=UTF-8"}}
        );
    }
}

export default new UserService();