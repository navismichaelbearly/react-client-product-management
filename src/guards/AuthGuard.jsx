import React from "react";
import { Navigate } from "react-router-dom";
import UserService from '../services/user.service';

class AuthGuard extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { roles , children} = this.props;
        const currentUser = UserService.currentUserValue;
        if(!currentUser) {
            return <Navigate to="/login" replace />;
        }

        if(roles && roles.indexOf(currentUser.role) === -1 ) {
            return <Navigate to="/401" replace />;
        }

        return children;
    }   
}

export default AuthGuard;