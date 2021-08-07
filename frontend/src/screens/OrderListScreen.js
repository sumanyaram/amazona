import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { deleteOrder, listOrders } from '../actions/orderActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { ORDER_DELETE_RESET } from '../constants/orderConstants';

function OrderListScreen(props) {
  
    const dispatch = useDispatch();

    const ordersList = useSelector(state => state.ordersAdminList);
    const { loading, error, orders } = ordersList;
 
    const orderDeleted = useSelector(state => state.orderDelete);
    const { loading: deleteLoading, error: deleteError, success: deleteSuccess } = orderDeleted;

    useEffect(() => {
        dispatch(listOrders());

        if (deleteSuccess)
        {
            dispatch({type: ORDER_DELETE_RESET})
        }
    }, [dispatch, deleteSuccess]);

    
    const deleteHandler = (order) => {
        if (window.confirm('Are you sure to delete?'))
        {
            dispatch(deleteOrder(order._id));
        }
    };

    return (
        <div>            
            <h1>Order History</h1>

            {deleteLoading && <LoadingBox></LoadingBox>}
            {deleteError && <MessageBox variant="danger">{deleteError}</MessageBox>}

            {loading ? (<LoadingBox></LoadingBox>) :
            error ? (<MessageBox variant="danger">{error}</MessageBox>) :
            (
                <table className="table">
                    <thead>
                        <th>Id</th>
                        <th>User</th>
                        <th>Date</th>
                        <th>Total Price</th>
                        <th>Payment Status</th>
                        <th>Delivery Status</th>
                        <th>Actions</th>
                    </thead>
                    <tbody>
                        {orders && orders.map((order) => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.user.name}</td>
                                <td>{order.createdAt}</td>
                                <td>${order.totalPrice.toFixed(2)}</td>
                                <td>{order.isPaid ? order.paidAt.substring(0, 10) : "Not Paid" }</td>
                                <td>{order.isDelivered ? order.deliveredAt.substring(0, 10) : "Not Delivered" }</td>
                                <td>
                                    <button className="small" 
                                        // eslint-disable-next-line react/prop-types
                                        onClick={() => {props.history.push(`/order/${order._id}`)}}>Details
                                    </button>
                                    <button className="small" 
                                        // eslint-disable-next-line react/prop-types
                                        onClick={() => deleteHandler(order)}>Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}

export default OrderListScreen
