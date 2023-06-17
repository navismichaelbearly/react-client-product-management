import React from "react";
import AdminService from "../../services/admin.service";
import UserService from "../../services/user.service";
import $ from 'jquery';


class UserModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            user: this.props.user,
            submitted: false,
            loading: false,
            errorMessage: ''
        };
    }

    componentDidMount() {
        const { handleModalCloseClick } = this.props;
        $(this.modal).modal('show');
        $(this.modal).on('hidden.bs.modal', handleModalCloseClick)
    }

    handleCloseClick() {
        const { handleModalCloseClick } = this.props;
        $(this.modal).modal('hide');
        handleModalCloseClick();
    }

    handleChange(event) {
        var { name, value } = event.target;
        var user = this.state.user;
        user[name] = value;
        this.setState({user: user})
    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({submitted: true})
        const { user } = this.state;

        if(!(user.username && user.password && user.name)) {
            return;
        }

        this.setState({loading: true });
        if(user.id !== -1 ) {
            this.updateUser(user);
        } else {
            this.createUser(user);
        }
    }

    createUser(user) {
        UserService.register(user)
            .then(
                data => {
                    //call props from parent
                    this.props.onChildUpdate(data.data, true, false);
                    this.handleCloseClick();
                },
                error => {
                    this.props.onChildUpdate(null, false,false);
                    this.setState({
                        errorMessage: "Unexpected error occured.",
                        loading: false
                    })
                }
            );
    }

    updateUser(user) {
        AdminService.updateUser(user)
            .then(
                data => {
                    //call props from parent
                    this.props.onChildUpdate(data.data, true, true);
                    this.handleCloseClick();
                },
                error => {
                    this.props.onChildUpdate(null, false,false);
                    this.setState({
                        errorMessage: "Unexpected error occured.",
                        loading: false
                    })
                }
            );
    }

    render() {
        const { user, submitted, loading, errorMessage } = this.state;

        return (
            <div>
                {user &&
                    <div className="modal fade" id="userModal" tabIndex="-1" ref={modal => this.modal = modal} role="dialog" aria-labelledby="userModalLabel" aria-hidden="true">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <form name="form-user-update" onSubmit= { e => this.handleSubmit(e)}>
                                    <div className="modal-header">
                                        <h5 className="modal-title">User Details</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times</span>
                                        </button>
                                    </div>

                                    <div className="modal-body">
                                        { errorMessage &&
                                            <div className="alert alert-danger" role="alert">
                                                <strong>Error! </strong> {errorMessage}
                                            </div>
                                        }
                                        <div className={'form-group' + (submitted && user.name ? 'has-error' : '')}>
                                            <label htmlFor="name">Full Name</label>
                                            <input type="text" className="form-control" name="name" value={user.name} onChange={ e => this.handleChange(e)} />
                                            { submitted && !user.name &&
                                                <div className="alert alert-danger" role="alert">Full name is required.</div>
                                            }
                                        </div>
                                        <div className={'form-group' + (submitted && user.username ? 'has-error' : '')}>
                                            <label htmlFor="username">Username</label>
                                            <input type="text" className="form-control" name="username" value={user.username} onChange={ e => this.handleChange(e)} />
                                            { submitted && !user.username &&
                                                <div className="alert alert-danger" role="alert">Username is required.</div>
                                            }
                                        </div>
                                        <div className={'form-group' + (submitted && user.password ? 'has-error' : '')}>
                                            <label htmlFor="passowrd">Password</label>
                                            <input readOnly={user.id!==-1} type="password" className="form-control" name="password" value={user.password} onChange={ e => this.handleChange(e)} />
                                            { submitted && !user.password &&
                                                <div className="alert alert-danger" role="alert">Password is required.</div>
                                            }
                                        </div>   
                                        <div className={'form-group' + (submitted && user.role ? 'has-error' : '')}>
                                            <label htmlFor="role">User role</label>
                                            <select className="form-control" name="role" required value={user.role} onChange={ e => this.handleChange(e)}>
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
                                        <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => this.handleCloseClick()}>
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
                }
            </div>
        )
    }


}

export default UserModal;