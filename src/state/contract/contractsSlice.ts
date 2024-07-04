// /contract/contractsSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Contract {
    id: string;
    name: string;
    cost: number; // Monthly cost
    duration: number; // Duration in months
}

interface ContractsState {
    contracts: Contract[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    monthlyTotal: number;
    yearlyTotal: number;
}

const initialState: ContractsState = {
    contracts: [],
    status: 'idle',
    error: null,
    monthlyTotal: 0,
    yearlyTotal: 0,
};

export const fetchContracts = createAsyncThunk('contracts/fetchContracts', async () => {
    const response = await axios.get('/api/contracts');
    return response.data;
});

export const addContract = createAsyncThunk('contracts/addContract', async (contract: Contract) => {
    const response = await axios.post('/api/contracts', contract);
    return response.data;
});

export const updateContract = createAsyncThunk('contracts/updateContract', async (contract: Contract) => {
    const response = await axios.put(`/api/contracts/${contract.id}`, contract);
    return response.data;
});

export const deleteContract = createAsyncThunk('contracts/deleteContract', async (id: string) => {
    await axios.delete(`/api/contracts/${id}`);
    return id;
});

const contractsSlice = createSlice({
    name: 'contracts',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchContracts.fulfilled, (state, action) => {
                state.contracts = action.payload;
                state.monthlyTotal = state.contracts.reduce((total, contract) => total + contract.cost, 0);
                state.yearlyTotal = state.monthlyTotal * 12;
            })
            // Implement other cases for add, update, and delete based on the API's response structure
            .addCase(addContract.fulfilled, (state, action) => {
                state.contracts.push(action.payload);
                state.monthlyTotal += action.payload.cost;
                state.yearlyTotal = state.monthlyTotal * 12;
            })
            .addCase(updateContract.fulfilled, (state, action) => {
                const index = state.contracts.findIndex(c => c.id === action.payload.id);
                if (index !== -1) {
                    state.monthlyTotal -= state.contracts[index].cost;
                    state.contracts[index] = action.payload;
                    state.monthlyTotal += action.payload.cost;
                    state.yearlyTotal = state.monthlyTotal * 12;
                }
            })
            .addCase(deleteContract.fulfilled, (state, action) => {
                const index = state.contracts.findIndex(c => c.id === action.payload);
                if (index !== -1) {
                    state.monthlyTotal -= state.contracts[index].cost;
                    state.contracts.splice(index, 1);
                    state.yearlyTotal = state.monthlyTotal * 12;
                }
            });
    },
});

export default contractsSlice.reducer;
