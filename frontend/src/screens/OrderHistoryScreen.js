import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getOrdersList } from '../actions/orderActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

function OrderHistoryScreen(props) {
    const ordersList = useSelector(state => state.ordersList);
    const {loading, error, orders } = ordersList;

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getOrdersList());
    }, [dispatch]);

    return (
        <div>
            <h1>Order History</h1>

            {loading ? (<LoadingBox></LoadingBox>) :
            error ? (<MessageBox variant="danger">{error}</MessageBox>) :
            (
                <table className="table">
                    <thead>
                        <th>Id</th>
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
                                <td>{order.createdAt}</td>
                                <td>${order.totalPrice.toFixed(2)}</td>
                                <td>{order.isPaid ? order.paidAt.substring(0, 10) : "Not Paid" }</td>
                                <td>{order.isDelivered ? order.deliveredAt.substring(0, 10) : "Not Delivered" }</td>
                                <td>
                                    <button className="small" 
                                        // eslint-disable-next-line react/prop-types
                                        onClick={() => {props.history.push(`/order/${order._id}`)}}>Details</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>

    )
}

export default OrderHistoryScreen
