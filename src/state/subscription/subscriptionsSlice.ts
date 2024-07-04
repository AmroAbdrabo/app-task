import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios'; // if this line throws an error (and axios is already installed), remove it and add it again 

interface Subscription {
    id: string;
    name: string;
    cost: number; // Monthly cost
    duration: number; // Duration in months
}

interface SubscriptionsState {
    subscriptions: Subscription[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    monthlyTotal: number;
    yearlyTotal: number;
}

const initialState: SubscriptionsState = {
    subscriptions: [],
    status: 'idle',
    error: null,
    monthlyTotal: 0,
    yearlyTotal: 0,
};

export const fetchSubscriptions = createAsyncThunk('subscriptions/fetchSubscriptions', async () => {
    const response = await axios.get('/api/subscriptions');
    return response.data;
});

export const addSubscription = createAsyncThunk('subscriptions/addSubscription', async (subscription: Subscription) => {
    const response = await axios.post('/api/subscriptions', subscription);
    return response.data;
});

export const updateSubscription = createAsyncThunk('subscriptions/updateSubscription', async (subscription: Subscription) => {
    const response = await axios.put(`/api/subscriptions/${subscription.id}`, subscription);
    return response.data;
});

export const deleteSubscription = createAsyncThunk('subscriptions/deleteSubscription', async (id: string) => {
    await axios.delete(`/api/subscriptions/${id}`);
    return id;
});

const subscriptionsSlice = createSlice({
    name: 'subscriptions',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchSubscriptions.fulfilled, (state, action) => {
                state.subscriptions = action.payload;
                state.monthlyTotal = state.subscriptions.reduce((total, sub) => total + sub.cost, 0);
                state.yearlyTotal = state.monthlyTotal * 12;
            })
            // Add other cases for add, update, delete
    },
});

export default subscriptionsSlice.reducer;