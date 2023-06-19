import {useState, useEffect, useRef} from 'react';
import AdminService from '../../services/admin.service';

import { User } from '../../models/user';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrashAlt} from '@fortawesome/free-solid-svg-icons';
import './AdminPage.css';
import UserModal from '../modals/UserModal';
import DeleteModal from '../modals/DeleteModal';

const AdminPage = () => {
    const [selectedUser, setSelectedUser] = useState(new User());
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [infoMessage, setInfoMessage] = useState('');
    const [showModal,setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const childUserModal = useRef();
    const childDeleteModal = useRef();


    useEffect( () => {
        AdminService.findAllUsers()
            .then(users => {
                setUsers(users.data);
                setLoading(false);
            })
    }, [loading] );

    const createUserRequest = () => {
        setSelectedUser(new User('','','','',-1));
        setShowModal(true);
    }

    const editUserRequest = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    }

    const deleteUserRequest = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    }

    const handleModalCloseClick = () => {
        setShowModal(false);
    }

    const handleDeleteModalCloseClick = () => {
        setShowDeleteModal(false);
    }

    const onChildUpdate = (user, isSucceed, isUpdate) => {
        if(!isSucceed) {
            return;
        }
        else {
            saveUser(user, isUpdate);
            setInfoMessage('Mission is completed');
        }
    }

    const saveUser = (user,isUpdate) => {
        if(isUpdate) {
            updateUser(user);
        }
        else {
            createUserRequest(user);
        }
    }

    const createUser = (user) => {
        users.push(user);
    }

    const updateUser = (user) => {
        var userList = users;
        let itemIndex = userList.findIndex(item => item.id === user.id);
        userList[itemIndex] = user;
        setUsers(userList);
    }

    const onDeleteChildUpdate = (user, isSucceed) => {
        if(!isSucceed) {
            return;
        }
        var userList = users;
        let itemIndex = userList.findIndex(item => item.id === user.id);
        if(itemIndex !== -1) {
            userList.splice(itemIndex, 1);
            setUsers(userList);
            setInfoMessage('Mission is completed');
        }
    }

    return (
        <div className="col-md-12">
            <div >
                {infoMessage &&
                    <div className="alert alert-success">
                        <strong>Successfull! </strong> {infoMessage}
                        <button type='button' className='close' data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times</span>
                        </button>
                    </div>
                }
                {loading && <em>Loading users...</em>}
                {users.length && 
                    <div className='card'>
                        <div className='card-header'>
                            <div className='row'>
                                <div className='col col-xs-6'>
                                    <h3 className='panel-title'>All Users</h3>
                                </div>
                                <div className='col col-xs-6 text-right'>
                                    <button type='button' className='btn btn-primary' data-bs-target="#userModal" onClick={() => createUserRequest()}>Create New User</button>
                                </div>
                            </div>
                        </div>

                        <div className='card-body'>
                            <table className='table table-striped'>
                                <thead>
                                    <tr>
                                        <th scope='col'>#</th>
                                        <th scope='col'>Name</th>
                                        <th scope='col'>Role</th>
                                        <th scope='col'>Username</th>
                                        <th scope='col'>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user, index) =>
                                        <tr key={user.id}>
                                            <th scope='row'>{index + 1}</th>
                                            <td>{user.name}</td>
                                            <td>{user.username}</td>
                                            <td>{user.role}</td>
                                            <td>
                                                <button className='btn btn-warning' onClick={() => editUserRequest(user)}>
                                                    <FontAwesomeIcon icon={faPen}/>
                                                </button>
                                                <button className='btn btn-danger' onClick={() => deleteUserRequest(user)}>
                                                    <FontAwesomeIcon icon={faTrashAlt}/>
                                                </button>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                }
            </div>
            {showModal && (<UserModal 
                                                    onChildUpdate={(user, isSucceed, isUpdate) => onChildUpdate(user, isSucceed, isUpdate)}
                                                    handleModalCloseClick={()=> handleModalCloseClick()} 
                                                    selectedUser={selectedUser} />) }
            
            {showDeleteModal && <DeleteModal 
                                                handleDeleteModalCloseClick={() => handleDeleteModalCloseClick}
                                                onDeleteChildUpdate={(user,isSucceed) => onDeleteChildUpdate(user, isSucceed)}
                                                        
                                                    />  }    
        </div>
    );
    
}

export default AdminPage;