/* eslint-disable react/prop-types */
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteUser, listUsers } from '../actions/userActions';
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import { USER_DETAILS_RESET } from '../constants/userConstants';

function UserListScreen(props) {

    const userList = useSelector(state => state.userList);
    const {loading, error, users} = userList;

    const userDelete = useSelector(state => state.userDelete);
    const {loading: loadingDelete, error: errorDelete, success: successDelete} = userDelete;

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(listUsers());
        dispatch({type: USER_DETAILS_RESET});
    }, [dispatch, successDelete]);

    const deletehandler = (user) => {
        
        if (window.confirm('Are you sure to delete?'))
        {
            dispatch(deleteUser(user._id));
        }
    }


    return (
        <div>
            <h1>Users</h1>
            {loadingDelete && <LoadingBox></LoadingBox>}
            {errorDelete && <MessageBox variant="danger">{errorDelete}</MessageBox>}
            {successDelete && <MessageBox variant="success">User deleted</MessageBox>}
            {
                loading ? (<LoadingBox></LoadingBox>)
                : error ? (<MessageBox variant="danger">{error}</MessageBox>)
                : 
                (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Is Seller</th>
                                <th>Is Admin</th>
                                <th>Actions</th>                            
                            </tr>
                        </thead>
                        <tbody>
                        {
                            users.map((user) => (
                                <tr key={user._id}>
                                    <td>{user._id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.isSeller ? "Yes" : "No"}</td>
                                    <td>{user.isAdmin ? "Yes" : "No"}</td>
                                    <td>
                                        <button type="button" className="small" onClick={() => props.history.push(`/user/${user._id}/edit`)}>Edit</button>
                                        <button type="button" className="small" onClick={() => deletehandler(user)}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        }
                        </tbody>
                    </table>
                )
            }
        </div>
    )
}

export default UserListScreen
