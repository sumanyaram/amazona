/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { createProduct, deleteProduct, listProducts } from '../actions/productActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { PRODUCT_CREATE_RESET, PRODUCT_DELETE_RESET } from '../constants/productConstants';

function ProductListScreen(props) {

    const productList = useSelector(state => state.productList);
    const { loading, error, products } = productList;

    const productCreate = useSelector(state => state.productCreate);
    const {loading: createloading, error: createerror, success: createsuccess, product: createdproduct} = productCreate;

    const productDelete = useSelector(state => state.productDelete);
    const {loading: deleteloading, error: deleteerror, success: deletesuccess} = productDelete;


    const dispatch = useDispatch();

    useEffect(() => {
        if (createsuccess)
        {
            dispatch({type:PRODUCT_CREATE_RESET});
            props.history.push(`/product/${createdproduct._id}/edit`);
        }

        if (deletesuccess)
        {
            dispatch({type: PRODUCT_DELETE_RESET});
            props.history.push();
        }

        dispatch(listProducts());
    }, [dispatch, createProduct, props.history, createsuccess, deletesuccess]);


    const deleteHandler = (product) => {
        // TODO: dispatch delete handler

        if (window.confirm('Are you sure to delete?'))
        {
            dispatch(deleteProduct(product._id));
        }
    };

    const createHandler = () => {
        dispatch(createProduct());
    };

    return (
        <div>
            <div className="row">
                <h1>Products</h1>
                <button type="button" className="primary" onClick={createHandler}>Create Product</button>
            </div>
            
            {deleteloading && <LoadingBox></LoadingBox>}
            {deleteerror && <MessageBox variant="danger">{deleteerror}</MessageBox>}

            {createloading && <LoadingBox></LoadingBox>}
            {createerror && <MessageBox variant="danger">{createerror}</MessageBox>}

            {loading ? <LoadingBox></LoadingBox>
            : error ? <MessageBox variant="danger">{error}</MessageBox>
            : <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Brand</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        products && products.map((product) => (
                            <tr key={product._id}>
                                <td>{product._id}</td>  
                                <td>{product.name}</td>                                
                                <td>${product.price}</td>
                                <td>{product.category}</td>
                                <td>{product.brand}</td>
                                <td>
                                    <button type="button" className="small" onClick={() => props.history.push(`/product/${product._id}/edit`)}>
                                        Edit
                                    </button>
                                    <button type="button" className="small" onClick={() => deleteHandler(product)}>Delete</button>
                                </td>
                            </tr>
                    ))}
                </tbody>
            </table>
            }
        </div>
    )
}

export default ProductListScreen
