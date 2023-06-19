import React, { useEffect, useState, useRef } from "react";
import { Modal } from 'bootstrap';
import AdminService from '../../services/admin.service';
import UserService from '../../services/user.service';
import './DeleteModal.css';

const DeleteModal = ({selectedUser,handleDeleteModalCloseClick, onDeleteChildUpdate}) =>  {
    const childDeleteModal = useRef();
    const [user,setUser] = useState(selectedUser);
    const [modal, setModal] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading,setLoading] = useState(false);

    useEffect(() => {
        const modalEle = childDeleteModal.current;
        const bsModal = new Modal(modalEle, {keyboard: false});
        setModal(bsModal);
        bsModal.show();
        handleDeleteModalCloseClick();
    },[]);

    const handleCloseClick = () => {
        modal.hide();
        handleDeleteModalCloseClick();
    }

    const deleteUser = (e) => {
        e.preventDefault();
        AdminService.deleteUser(user).then(
            data => {
                //call parent props
                onDeleteChildUpdate(user, true);
                handleCloseClick();
            },
            error => {
                //call parent props
                onDeleteChildUpdate(null, false);
                setErrorMessage("Unexpected error occured.");
                setLoading(false);
            }
        );
    }

        return (
            <div>
                {user &&
                        <div  ref={childDeleteModal} className="modal fade" id="deleteModal" tabIndex="-1" role="dialog" aria-labelledby="deleteModalLabel" aria-hidden="true">
                        <div className="modal-dialog" role="document" >
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Confirmation</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times</span>
                                    </button>
                                </div>

                                <div className="modal-body">
                                    Are you sure to delete <strong>{user.name}</strong>?
                                </div>

                                <div className="modal-footer">
                                    <button type="button" 
                                            className="btn btn-secondary" 
                                            data-dismiss="modal"
                                            onClick={() => handleCloseClick()}>
                                        Cancel
                                    </button>
                                    <button type="button" 
                                            className="btn btn-danger" 
                                            onClick={() => deleteUser()}>
                                        I'm Sure
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    
}

export default DeleteModal;