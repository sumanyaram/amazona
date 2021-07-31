/* eslint-disable react/prop-types */
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { addToCart } from '../actions/cartActions';

function CartScreen(props) {
    const productId = props.match.params.id;
    const qty = props.location.search
        ? Number(props.location.search.split('=')[1])
        : 1;

    const dispatch = useDispatch();
    useEffect(() => {
        if (productId) {
            dispatch(addToCart(productId, qty));
        }

    }, [dispatch, productId, qty]);

    return (
        <div>
            <h1>
                Cart CartScreen
            </h1>
            <p>
                Add to cart: ProductId:{productId} Qty:{qty}
            </p>
        </div>
    )
}

export default CartScreen
