import { useEffect, useState, useRef} from "react";
import { Modal } from 'bootstrap';
import AdminService from "../../services/admin.service";
import UserService from "../../services/user.service";
import $ from 'jquery';


const UserModal = ({ handleModalCloseClick, onChildUpdate, selectedUser}) => {
    
    const childUserModal = useRef();
    const [user,setUser] = useState(selectedUser);
    const [modal, setModal] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage]  = useState('');

    useEffect(() => {
        const modal = new Modal(childUserModal.current, {keyboard: false})
        setModal(modal)
        modal.show()
    },[])

   const handleCloseClick = () => {
        modal.hide();
        handleModalCloseClick();
    }

    const handleChange = (event) => {
        var { name, value } = event.target;
        user[name] = value;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        
        if(!(user.username && user.password && user.name)) {
            return;
        }

        setLoading(true);
        if(user.id !== -1 ) {
            updateUser(user);
        } else {
            createUser(user);
        }
    }

    const createUser = (user) => {
        UserService.register(user)
            .then(
                data => {
                    //call props from parent
                    onChildUpdate(data.data, true, false);
                    handleCloseClick();
                },
                error => {
                    onChildUpdate(null, false,false);
                    setErrorMessage("Unexpected error occured");
                    setLoading(false);
                }
            );
    }

    const updateUser = (currentUser) => {
        AdminService.updateUser(currentUser)
            .then(
                data => {
                    //call props from parent
                    onChildUpdate(data.data, true, true);
                    handleCloseClick();
                },
                error => {
                    onChildUpdate(null, false,false);
                    setErrorMessage("Unexpected error occured");
                    setLoading(false);
                }
            );
    }



        return (
            <div>
                {user &&
                    <div className="py-2">
                        <div  ref={childUserModal} className="modal fade" id="userModal" tabIndex="-1" role="dialog" aria-labelledby="userModalLabel" aria-hidden="true">
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                    <form name="form-user-update" onSubmit= { e => handleSubmit(e)}>
                                        <div className="modal-header">
                                            <h5 className="modal-title">User Details</h5>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>

                                        <div className="modal-body">
                                            { errorMessage &&
                                                <div className="alert alert-danger" role="alert">
                                                    <strong>Error! </strong> {errorMessage}
                                                </div>
                                            }
                                            <div className={'form-group' + (submitted && user.name ? 'has-error' : '')}>
                                                <label htmlFor="name">Full Name</label>
                                                <input type="text" className="form-control" name="name"   onChange={e => user.name = e.target.value}  />
                                                { submitted && !user.name &&
                                                    <div className="alert alert-danger" role="alert">Full name is required.</div>
                                                }
                                            </div>
                                            <div className={'form-group' + (submitted && user.username ? 'has-error' : '')}>
                                                <label htmlFor="username">Username</label>
                                                <input type="text" className="form-control" name="username"  onChange={e => user.username = e.target.value} />
                                                { submitted && !user.username &&
                                                    <div className="alert alert-danger" role="alert">Username is required.</div>
                                                }
                                            </div>
                                            <div className={'form-group' + (submitted && user.password ? 'has-error' : '')}>
                                                <label htmlFor="passowrd">Password</label>
                                                <input readOnly={user.id!==-1} type="password" className="form-control" name="password"  onChange={e => user.password = e.target.value} />
                                            </div>   
                                            <div className={'form-group' + (submitted && user.role ? 'has-error' : '')}>
                                                <label htmlFor="role">User role</label>
                                                <select className="form-control" name="role" required  onChange={ e => handleChange(e)}>
                                                    <option value="">Choose</option>
                                                    <option value="USER">User</option>
                                                    <option value="ADMIN">Admin</option>
                                                </select>
                                                { submitted && !user.role &&
                                                    <div className="alert alert-danger" role="alert">Role is required.</div>
                                                }
                                            </div>    
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => handleCloseClick()}>
                                                Close
                                            </button>
                                            <button type="submit" className="btn btn-primary">
                                                Save Changes
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>

                        </div>
                    </div>
                }
            </div>
        )
    


}

export default UserModal;