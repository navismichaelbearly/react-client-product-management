import './App.css';
import React from 'react';
import { BrowserRouter, Route, Link, Routes, Navigate } from 'react-router-dom';
import { createBrowserHistory  } from "history";
import HomePage from './components/home/HomePage';
import LoginPage from './components/login/LoginPage';
import RegisterPage from './components/register/RegisterPage';
import ProfilePage from './components/profile/ProfilePage';
import DetailPage from './components/detail/DetailPage';
import AdminPage from './components/admin/AdminPage';
import NotFound from './components/errors/NotFound';
import Unauthorized from './components/errors/Unauthorized';
import AuthGuard from './guards/AuthGuard';
import { Role } from './models/role';
import UserService from './services/user.service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserPlus, faSignInAlt, faHome, faSignOutAlt, faUserShield} from '@fortawesome/free-solid-svg-icons';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      history: createBrowserHistory(),
      currentUser: null,
      isAdmin: false,
      errorMessage: '',
      currentLocation: window.location.pathname,
    }
  }

  componentWillMount() {
    this.unlisten = this.state.history.listen((location, action) => {
      this.setState({currentLocation: location.pathname});
    })
  }

  componentWillUnmount() {
    this.unlisten();
  }

  componentDidMount() {
    UserService.currentUser.subscribe(data => {
      this.setState({
        currentUser: data,
        isAdmin: data && data.role === Role.ADMIN
      })
    })
  }

  logout() {
    UserService.logout()
      .then(
          data => {
            this.state.history.push('/home')
          },
          error => {
            this.setState({
              errorMessage: "Unexpected error occured"
            })
          }

      );
  }
  
  render() {
    const { currentUser, isAdmin, history, currentLocation } = this.state;

    return (
      <div>
      <BrowserRouter history={history}>
     
        
        <div>
        {this.state.currentUser && 
          <nav className='navbar navbar-expand navbar-dark bg-dark'>
            <div className='container-fluid'>
            <a className='navbar-brand' href="https://reactjs.org">
                Apple App
            </a>
            <div className='navbar-nav me-auto'>
                <Link to="/home" className={currentLocation === "/home" ? 'nav-item nav-link active' : 'nav-item nav-link' }><FontAwesomeIcon icon={faHome}/>Home</Link>
                {isAdmin && <Link to="/admin" className={currentLocation === "/admin" ? 'nav-item nav-link active' : 'nav-item nav-link' }><FontAwesomeIcon icon={faUserShield}/>Admin</Link>}
            </div>
            <div className='navbar-nav ms-auto'>
                <Link to="/profile" className={currentLocation === "/profile" ? 'nav-item nav-link active' : 'nav-item nav-link' }><FontAwesomeIcon icon={faUser}/>{currentUser.name}</Link>
                <a href="#" onClick= {()=> this.logout()} className='nav-item nav-link'><FontAwesomeIcon icon={faSignOutAlt}/>Logout</a>
            </div>
            </div>
          </nav>
        }

      {!this.state.currentUser && 
          <nav className='navbar navbar-expand navbar-dark bg-dark'>
            <div className='container-fluid'>
              <a className='navbar-brand' href="https://reactjs.org">
                  Public Apple App
              </a>
              <div className='navbar-nav me-auto'>
                  <Link to="/home" className={currentLocation === "/home" ? 'nav-item nav-link active' : 'nav-item nav-link' }><FontAwesomeIcon icon={faHome}/>Home</Link>
              </div>
              <div className='navbar-nav ms-auto'>
                  <Link to="/register" className={currentLocation === "/register" ? 'nav-item nav-link active' : 'nav-item nav-link' }><FontAwesomeIcon icon={faUserPlus}/>Register</Link>
                  <Link to="/login" className={currentLocation === "/login" ? 'nav-item nav-link active' : 'nav-item nav-link' }><FontAwesomeIcon icon={faSignInAlt}/>Login</Link>
              </div>
            </div>
          </nav>
        }

        </div>
        
          <div className='container'>
              <Routes>
                  <Route exact path="/" element={<HomePage/>} />
                  <Route exact path="/home" element={<HomePage/>} />
                  <Route exact path="/login" element={<LoginPage/>} />
                  <Route exact path="/register" element={<RegisterPage/>} />
                  <Route path="/profile"
                    element={
                      <AuthGuard roles={[Role.ADMIN, Role.USER]}> 
                        <ProfilePage/>
                      </AuthGuard>
                    }
                  />
                  <Route exact path="/detail/:id" element={<DetailPage/>} />
                  <Route path="/admin"
                    element={
                      <AuthGuard roles={[Role.ADMIN]}> 
                        <AdminPage/>
                      </AuthGuard>
                    }
                  />
                  <Route exact path="/404" element={<NotFound/>} />
                  <Route exact path="/401" element={<Unauthorized/>} />
                  <Route path="*" element={<Navigate to="/404" replace={true} />} />

              </Routes>
          </div>
        
     
      </BrowserRouter>
      </div>
    );
  }
}

export default App;
