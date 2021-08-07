import { ORDER_ADMIN_LIST_FAIL, ORDER_ADMIN_LIST_REQUEST, ORDER_ADMIN_LIST_SUCCESS, ORDER_CREATE_FAIL, ORDER_CREATE_REQUEST, ORDER_CREATE_SUCCESS, ORDER_DELETE_FAIL, ORDER_DELETE_REQUEST, ORDER_DELETE_SUCCESS, ORDER_DELIVER_FAIL, ORDER_DELIVER_REQUEST, ORDER_DELIVER_SUCCESS, ORDER_DETAILS_FAIL, ORDER_DETAILS_REQUEST, ORDER_DETAILS_SUCCESS, ORDER_LIST_FAIL, ORDER_LIST_REQUEST, ORDER_LIST_SUCCESS } from "../constants/orderConstants"
import Axios from 'axios';
import { CART_EMPTY } from "../constants/cartConstants";

export const detailsOrder = (orderId) => async (dispatch, getState) => {
    dispatch({
        type: ORDER_DETAILS_REQUEST,
        payload: orderId
    });

    try {
        const { userSignin: { userInfo } } = getState();
        const { data } = await Axios.get(`/api/orders/${orderId}`, {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            },
        });

        dispatch({
            type: ORDER_DETAILS_SUCCESS,
            payload: data
        });
    }
    catch (error) {
        dispatch({
            type: ORDER_DETAILS_FAIL,
            payload: error.response && error.response.data.message ?
                error.response.data.message :
                error.message
        });
    }
}

export const createOrder = (order) => async (dispatch, getState) => {
    dispatch({
        type: ORDER_CREATE_REQUEST,
        payload: order
    });

    try {
        const { userSignin: { userInfo } } = getState();
        const { data } = await Axios.post('/api/orders', order, {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            },
        });

        dispatch({
            type: ORDER_CREATE_SUCCESS,
            payload: data.order
        });

        dispatch({
            type: CART_EMPTY,
            payload: {}
        });

        localStorage.removeItem("cartItems");
    }
    catch (error) {
        dispatch({
            type: ORDER_CREATE_FAIL,
            payload: error.response && error.response.data.message ?
                error.response.data.message :
                error.message
        });
    }
}

export const getOrdersList = () => async (dispatch, getState) => {
    dispatch({
        type: ORDER_LIST_REQUEST
    });

    try {
        const { userSignin: { userInfo } } = getState();
        const { data } = await Axios.get(`/api/orders/mine`, {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            },
        });

        dispatch({
            type: ORDER_LIST_SUCCESS,
            payload: data
        });
    }
    catch (error) {
        dispatch({
            type: ORDER_LIST_FAIL,
            payload: error.response && error.response.data.message ?
                error.response.data.message :
                error.message
        });
    }

}

export const listOrders = () => async(dispatch, getState) => {
    dispatch({
        type: ORDER_ADMIN_LIST_REQUEST
    });

    try {
        const { userSignin: { userInfo } } = getState();
        const { data } = await Axios.get(`/api/orders`, {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            },
        });

        dispatch({
            type: ORDER_ADMIN_LIST_SUCCESS,
            payload: data
        });
    }
    catch (error)
    {   
        dispatch({type: ORDER_ADMIN_LIST_FAIL, payload: error.response && error.response.data.message ?
            error.response.data.message :
            error.message});
    }
}


export const deleteOrder = (orderId) => async(dispatch, getState) => {
    dispatch({
        type: ORDER_DELETE_REQUEST,
        payload: orderId
    });

    try {
        const { userSignin: { userInfo } } = getState();
          
        const {data} = await Axios.delete(`/api/orders/${orderId}`, {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            },
        });

        dispatch({type: ORDER_DELETE_SUCCESS, payload: data.order});
    }
    catch (error)
    {
        dispatch({type: ORDER_DELETE_FAIL, payload: error.response && error.response.data.message ?
            error.response.data.message :
            error.message});
    }
}


export const deliverOrder = (orderId) => async(dispatch, getState) => {
    dispatch({
        type: ORDER_DELIVER_REQUEST,
        payload: orderId
    });

    try {
        const { userSignin: { userInfo } } = getState();
          
        const {data} = await Axios.put(`/api/orders/${orderId}/deliver`, {}, {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            },
        });

        dispatch({type: ORDER_DELIVER_SUCCESS, payload: data});
    }
    catch (error)
    {
        dispatch({type: ORDER_DELIVER_FAIL, payload: error.response && error.response.data.message ?
            error.response.data.message :
            error.message});
    }
}