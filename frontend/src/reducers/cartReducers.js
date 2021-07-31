/* eslint-disable no-case-declarations */
import { CART_ADD_ITEM, CART_REMOVE_ITEM } from "../constants/cartConstants";

export const cartReducer = (state = { cartItems: [] }, action) => {
    switch (action.type) {
        case CART_ADD_ITEM:
            const item = action.payload;
            const existingItem = state.cartItems.find((x) => x.product === item.product);
            if (existingItem) {
                return { 
                    ...state,
                    cartItems: state.cartItems.map(x => x.product === existingItem.product ? item : x) };
            }
            else
            {
                return { ...state, cartItems: [...state.cartItems, item]};
            }
        case CART_REMOVE_ITEM:
            // update the redux store, to remove the item that matches the product (productId)
            return {...state, cartItems: state.cartItems.filter(x => x.product !== action.payload)};
        default:
            return state;
    }
};
