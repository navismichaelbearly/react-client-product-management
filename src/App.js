import './App.css';
import { useState, useEffect } from "react";
import { Route, Link, Routes, Navigate, useNavigate } from 'react-router-dom';
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

function App() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    UserService.currentUser.subscribe(data => {
      setCurrentUser(data);
      setIsAdmin(data && data.role === Role.ADMIN)
    })

  },[currentUser]);

  const logout = () => {
    UserService.logout()
      .then(
          data => {
            navigate('/home')
            console.log("test");
          },
          error => {
            setErrorMessage("Unexpected error occured");
          }

      );
  }
  
  return (
      <div>
     
     
        
        <div>
        {currentUser && 
          <nav className='navbar navbar-expand navbar-dark bg-dark'>
            <div className='container-fluid'>
            <a className='navbar-brand' href="https://reactjs.org">
                Apple App
            </a>
            <div className='navbar-nav me-auto'>
                <Link to="/home" className='nav-item nav-link'><FontAwesomeIcon icon={faHome}/>Home</Link>
                {isAdmin && <Link to="/admin" className='nav-item nav-link'><FontAwesomeIcon icon={faUserShield}/>Admin</Link>}
            </div>
            <div className='navbar-nav ms-auto'>
                <Link to="/profile" className='nav-item nav-link'><FontAwesomeIcon icon={faUser}/>{currentUser.name}</Link>
                <a href="#" onClick={logout} className='nav-item nav-link'><FontAwesomeIcon icon={faSignOutAlt}/>Logout</a>
            </div>
            </div>
          </nav>
        }

      {!currentUser && 
          <nav className='navbar navbar-expand navbar-dark bg-dark'>
            <div className='container-fluid'>
              <a className='navbar-brand' href="https://reactjs.org">
                  Public Apple App
              </a>
              <div className='navbar-nav me-auto'>
                  <Link to="/home" className='nav-item nav-link'><FontAwesomeIcon icon={faHome}/>Home</Link>
              </div>
              <div className='navbar-nav ms-auto'>
                  <Link to="/register" className='nav-item nav-link'><FontAwesomeIcon icon={faUserPlus}/>Register</Link>
                  <Link to="/login" className='nav-item nav-link'><FontAwesomeIcon icon={faSignInAlt}/>Login</Link>
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
        
     
     
      </div>
    );
  
}

export default App;
