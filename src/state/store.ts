import { configureStore } from '@reduxjs/toolkit';
import subscriptionsReducer from './subscription/subscriptionsSlice';
import contractsReducer from './contract/contractsSlice';


const store = configureStore({
    reducer: {
        subscriptions: subscriptionsReducer,
        contracts: contractsReducer,
    },
});

export default store;

//export type RootState = ReturnType<typeof store.getState>;
//export type AppDispatch = typeof store.dispatch;