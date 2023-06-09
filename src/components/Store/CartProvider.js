import React, { useReducer } from "react";
import CartContext from "./CartContext";

const defaultCart = {
  items: [],
  totalAmount: 0,
};
const cartReducer = (state, action) => {
  if (action.type === "ADD") {
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.item.id
    );
    const existingCartItem = state.items[existingCartItemIndex];
    let updatedItems;

    if (existingCartItem) {
      let updatedItem;
      updatedItem = {
        ...existingCartItem,
        amount: existingCartItem.amount + action.item.amount,
      };
      updatedItems = [...state.items];
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      updatedItems = state.items.concat(action.item);
    }

    const updatedAmount =
      state.totalAmount + action.item.price * action.item.amount;
    return {
      items: updatedItems,
      totalAmount: updatedAmount,
    };
    
  }
  if(action.type === 'REMOVE'){
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.id
    );
    const existingItem = state.items[existingCartItemIndex];
    const updatedtotalAmount = state.totalAmount - existingItem.price;
    let updatedItems;
    if(existingItem.amount === 1) {
      updatedItems = state.items.filter(item => item.id !== action.id)
    }else{
     const updatedItem = {...existingItem, amount:existingItem.amount - 1};
      updatedItems = [...state.items];
      updatedItems[existingCartItemIndex] = updatedItem;
    }
    return {
      items:updatedItems,
      totalAmount:updatedtotalAmount
    }
  }
  if(action.type === 'CLEAR'){
    return defaultCart;
  }
  return defaultCart;
};
const CartProvider = (props) => {
  const [cartState, dispatchCartAction] = useReducer(cartReducer, defaultCart);
  const addItemToCartHandler = (item) => {
    dispatchCartAction({ type: "ADD", item: item });
  };
  const removeItemHandler = (id) => {
    dispatchCartAction({ type: "REMOVE", id: id });
  };
  const clearCartHandler = () => {
    dispatchCartAction({type:'CLEAR'})
  }
  const cartContext = {
    items: cartState.items,
    totalAmount: cartState.totalAmount,
    addItem: addItemToCartHandler,
    removeItem: removeItemHandler,
    clearCart:clearCartHandler
  };

  return (
    <CartContext.Provider value={cartContext}>
      {props.children}
    </CartContext.Provider>
  );
};
export default CartProvider;
