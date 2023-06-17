import React from 'react';
import AdminService from '../../services/admin.service';
import UserService from '../../services/user.service';
import { User } from '../../models/user';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrashAlt} from '@fortawesome/free-solid-svg-icons';
import './AdminPage.css';
import UserModal from '../modals/UserModal';
import DeleteModal from '../modals/DeleteModal';

class AdminPage extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            selectedUser: new User(),
            users: [],
            errorMessage: '',
            infoMessage: '',
            showModal: false,
            showDeleteModal: false,
        };
    }

    componentDidMount() {
        this.setState({
            users: {loading: true},
        });

        AdminService.findAllUsers()
            .then(users => {
                this.setState({users: users.data});
            }
        );
    }

    createUserRequest() {
        this.setState({
            selectedUser: new User('','','','',-1),
            showModal: true
        });
    }

    editUserRequest(user) {
        this.setState({
            selectedUser: user,
            showModal: true
        });
    }

    deleteUserRequest(user) {
        this.setState({
            selectedUser: user,
            showDeleteModal: true
        })
    }

    handleModalCloseClick() {
        this.setState({showModal: false});
    }

    handleDeleteModalCloseClick() {
        this.setState({showDeleteModal: false});
    }

    onChildUpdate(user, isSucceed, isUpdate) {
        if(!isSucceed) {
            return;
        }
        else {
            this.saveUser(user, isUpdate);
            this.setState({infoMessage: 'Mission is completed'});
        }
    }

    saveUser(user,isUpdate) {
        if(isUpdate) {
            this.updateUser(user);
        }
        else {
            this.createUserRequest(user);
        }
    }

    createUser(user) {
        var users = this.state.users;
        users.push(user);
        this.setState({users: users})
    }

    updateUser(user) {
        var userList = this.state.users;
        let itemIndex = userList.findIndex(item => item.id === user.id);
        userList[itemIndex] = user;
        this.setState({users: userList});
    }

    onDeleteChildUpdate(user, isSucceed) {
        if(!isSucceed) {
            return;
        }
        var userList = this.state.users;
        let itemIndex = userList.findIndex(item => item.id === user.id);
        if(itemIndex !== -1) {
            userList.splice(itemIndex, 1);
            this.setState({
                users: userList,
                infoMessage: 'Mission is completed'
            })
        }
    }

    render() {
        const { users, infoMessage } = this.state;

        return (
            <div>
                <div className="col-md-12">
                    {infoMessage &&
                        <div className="alert alert-success">
                            <strong>Successfull! </strong> {infoMessage}
                            <button type='button' className='close' data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times</span>
                            </button>
                        </div>
                    }
                    {users.loading && <em>Loading users...</em>}
                    {this.state.users.length && 
                        <div className='card'>
                            <div className='card-header'>
                                <div className='row'>
                                    <div className='col col-xs-6'>
                                        <h3 className='panel-title'>All Users</h3>
                                    </div>
                                    <div className='col col-xs-6 text-right'>
                                        <button type='button' className='btn btn-primary' onClick={() => this.createUserRequest()}>Create New User</button>
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
                                                    <button className='btn btn-warning' onClick={() => this.editUserRequest(user)}>
                                                        <FontAwesomeIcon icon={faPen}/>
                                                    </button>
                                                    <button className='btn btn-danger' onClick={() => this.deleteUserRequest(user)}>
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
                {this.state.showModal && (<UserModal ref="childUserModal" 
                                                        onChildUpdate={(user, isSucceed, isUpdate) => this.onChildUpdate(user, isSucceed, isUpdate)}
                                                        handleModalCloseClick={()=>this.handleModalCloseClick()} 
                                                        user={this.state.selectedUser} />) }
              
                {this.state.showDeleteModal && <DeleteModal ref="childDeleteModal"
                                                    handleDeleteModalCloseClick={() => this.handleDeleteModalCloseClick}
                                                    onDeleteChildUpdate={(user,isSucceed) => this.onDeleteChildUpdate(user, isSucceed)}
                                                            
                                                        />  }    
            </div>
        );
    }
}

export default AdminPage;