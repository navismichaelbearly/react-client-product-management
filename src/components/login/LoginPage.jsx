
import { useState } from "react";
import UserService from '../../services/user.service';
import { User } from "../../models/user";
import './LoginPage.css'
import {useNavigate} from "react-router-dom"

const LoginPage = () => {
    const navigate = useNavigate();
    const [user,setUser] = useState(new User('',''));
    const [errorMessage,setErrorMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = e => {
        e.preventDefault();

        setSubmitted(true);

       
        if(!(user.username && user.password)) {
            return;
        }

        setLoading(true);
        UserService.login(user)
            .then(
                data => {
                    navigate("/home");
                },
                error => {
                    console.log(error);
                    setErrorMessage("Username or password is not valid");
                    setLoading(false);
                }
            )
            
    }

    
        return (
            <div className="col-md-12">
                <div className="card card-container">
                    <img id="profile-id" className="profile-img-card" src="//ssl.gstatic.com/accounts/ui/avatar_2x.png" alt="profile shadow" />
                    { errorMessage &&
                        <div className="alert alert-danger" role="alert">
                            <strong>Error! </strong> {errorMessage}
                        </div>
                    }
                    <form name="form" onSubmit={handleLogin}>
                        <div className={'form-group' + (submitted && user.username ? 'has-error' : '')}>
                            <label htmlFor="username">Username</label>
                            <input type="text" className="form-control" name="username"  onChange={e => user.username = e.target.value} />
                            { submitted && !user.username &&
                                <div className="alert alert-danger" role="alert">Username is required.</div>
                            }
                        </div>
                        <div className={'form-group' + (submitted && user.password ? 'has-error' : '')}>
                            <label htmlFor="passowrd">Password</label>
                            <input type="password" className="form-control" name="password" onChange={e => user.password = e.target.value}  />
                            { submitted && !user.password &&
                                <div className="alert alert-danger" role="alert">Password is required.</div>
                            }
                        </div>
                        <div className="form-group">
                            <button className="btn btn-lg btn-primary btn-block btn-signin form-submit-button" disabled={loading}>Login</button>
                        </div>
                    
                    </form>
                </div>
            </div>
        );

    

}

export default LoginPage;