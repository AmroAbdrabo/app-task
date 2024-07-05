import { configureStore } from '@reduxjs/toolkit';
import contractsReducer from './contract/contractsSlice';


const store = configureStore({
    reducer: {
        contracts: contractsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;