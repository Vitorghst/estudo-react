// store.js
import { configureStore } from '@reduxjs/toolkit';

// Reducer
const initialState = {
  count: 0
};

function reducer(state = initialState, action: { type: any; }) {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'DECREMENT':
      return { ...state, count: state.count - 1 };
    default:
      return state;
  }
}

// Store
const store = configureStore({
  reducer: reducer
});

export default store;
