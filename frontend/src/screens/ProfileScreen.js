import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { detailsUser } from '../actions/userActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

function ProfileScreen() {

    const userSignin = useSelector(state => state.userSignin);
    const {userInfo} = userSignin;

    const userDetails = useSelector(state => state.userDetails);
    const {loading, error, user} = userDetails;

    const dispatch = useDispatch();
    

    useEffect(() => {
        dispatch(detailsUser(userInfo._id));
    }, [dispatch, userInfo._id]);

    
    const submitHandler = (e) => {
        e.preventDefault();

        // dispatch update profile action
    };

    return (
        <div>
            <form className="form" onSubmit={submitHandler}>
                <div><h1>User Profile</h1></div>
                {
                    loading ? <LoadingBox></LoadingBox> : 
                    error ? <MessageBox variant="danger">{error}</MessageBox> :
                    (
                        <>
                            <div>
                                <label htmlFor="name">User name</label>
                                <input type="text" id="name" placeholder="Enter user name" value={user.name}></input>
                            </div>
                            <div>
                                <label htmlFor="email">Email Address</label>
                                <input type="email" id="email" placeholder="Enter email address" value={user.email}></input>
                            </div>
                            <div>
                                <label htmlFor="password">Password</label>
                                <input type="password" id="password" placeholder="Enter password"></input>
                            </div>
                            <div>
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input type="password" id="confirmPassword" placeholder="Enter confirm password"></input>
                            </div>
                            <div>
                                <label />
                                <button className="primary" type="submit">
                                    Update
                                </button>
                            </div>
                        </>
                    )
                }
            </form>
        </div>
    )
}

export default ProfileScreen
