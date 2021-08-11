/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import React, { useEffect, useState } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { Link } from 'react-router-dom';
import { signin, signout } from '../actions/userActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

function SignoutScreen(props) {

    const redirect = '/';

    const userSignin = useSelector(state => state.userSignin);
    const { userInfo, loading, error } = userSignin;

    const dispatch = useDispatch();

    useEffect(() => {
        if (userInfo)
        {
            dispatch(signout());
        }
        
        props.history.push(redirect);

    }, [dispatch, userInfo, props.history, redirect]);

    return (
        <div>            
        </div>
    )
}

export default SignoutScreen
