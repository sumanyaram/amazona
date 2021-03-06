/* eslint-disable react/prop-types */
import React from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter, Link, Route } from 'react-router-dom';
import AdminRoute from './components/AdminRoute';
import PrivateRoute from './components/PrivateRoute';
import CartScreen from './screens/OrderCartScreen';
import HomeScreen from './screens/HomeScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import OrderListScreen from './screens/OrderListScreen';
import OrderScreen from './screens/OrderScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import ProductListScreen from './screens/ProductListScreen';
import ProductScreen from './screens/ProductScreen';
import ProfileScreen from './screens/ProfileScreen';
import RegisterScreen from './screens/RegisterScreen';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import SigninScreen from './screens/SigninScreen';
import SignoutScreen from './screens/SignoutScreen';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';

function App() {

    const cart = useSelector(state => state.cart);
    const {cartItems} = cart;

    const userSignin = useSelector(state => state.userSignin);
    const { userInfo } = userSignin;

    return (
        <BrowserRouter>
        <div className="grid-container">
        <header className="row">
            <div>
                <Link className="brand" to="/">amazona</Link>
            </div>

            <div>
                <Link to="/cart">Cart
                {
                    cartItems.length > 0 && (
                        <span className="badge">{cartItems.length}</span>
                    ) 
                }
                </Link>

                {
                    userInfo ?                   
                    (
                        <div className="dropdown">
                            <Link to="#">
                                {userInfo.name} <i className="fa fa-caret-down"></i>{' '}
                            </Link>
                            <ul className="dropdown-content">
                                <li>
                                    <Link to="/profile">User Profile</Link>
                                </li>
                                <li>
                                    <Link to="/ordershistory">Orders</Link>
                                </li>
                                <li>
                                    <Link to="/signout">Sign Out</Link>
                                </li>
                            </ul>
                        </div>
                    ) :
                    (<Link to="/signin">Sign In</Link>)
                }
                {
                    userInfo && userInfo.isAdmin && (
                        <div className="dropdown">
                            <Link to="#admin">
                                Admin <i className="fa fa-caret-down"></i>
                            </Link>
                            <ul className="dropdown-content">
                                <li>
                                    <Link to="/dashboard">Dashboard</Link>
                                </li>
                                <li>
                                    <Link to="/productlist">Products</Link>
                                </li>
                                <li>
                                    <Link to="/orderlist">Orders</Link>
                                </li>
                                <li>
                                    <Link to="/userlist">Users</Link>
                                </li>
                            </ul>
                        </div>
                    )
                }
            </div>

        </header>
        <main>
            <Route path="/cart/:id?" component={CartScreen}></Route>
            <Route path="/product/:id/edit" component={ProductEditScreen} exact={true}></Route>            
            <Route path="/product/:id" component={ProductScreen} exact={true}></Route>
            <Route path="/signin" component={SigninScreen}></Route>
            <Route path="/signout" component={SignoutScreen}></Route>   
            <Route path="/register" component={RegisterScreen}></Route>
            <Route path="/shipping" component={ShippingAddressScreen}></Route>
            <Route path="/payment" component={PaymentMethodScreen}></Route>  
            <Route path="/placeorder" component={PlaceOrderScreen}></Route>
            <Route path="/order/:id" component={OrderScreen}></Route>
            <Route path="/ordershistory" component={OrderHistoryScreen}></Route>
            <PrivateRoute path="/profile" component={ProfileScreen}></PrivateRoute>
            <AdminRoute path="/productlist" component={ProductListScreen}></AdminRoute>
            <AdminRoute path="/orderlist" component={OrderListScreen}></AdminRoute>
            <AdminRoute path="/userlist" component={UserListScreen}></AdminRoute>
            <AdminRoute path="/user/:id/edit" component={UserEditScreen}></AdminRoute>
            <Route path="/" component={HomeScreen} exact={true}></Route>            
        </main>
        <footer className="row center">
            All rights reserved @
        </footer>
    </div>
    </BrowserRouter>
    );
}

export default App;