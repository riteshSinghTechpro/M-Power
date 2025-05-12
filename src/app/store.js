import { configureStore } from '@reduxjs/toolkit';
import apiDataSlice from '../feature/apiDataSlice';

const store = configureStore({
  reducer: {
    // Add your reducers here
    apiData: apiDataSlice,
  },
});

export default store;
