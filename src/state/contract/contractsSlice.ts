import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const port = 5000;
const url = `http://localhost:${port}/api/contracts`;

interface Contract {
    id: number;
    name: string;
    cost: number;
    duration: number;
    cycle: number;
}

interface ContractsState {
    contracts: Contract[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    monthlyTotal: number;
    yearlyTotal: number;
}

const initialState: ContractsState = {
    contracts: [
        { id: 1, name: 'Rent', cost: 80, duration: 12, cycle: 50 },
        { id: 2, name: 'Electricity', cost: 60, duration: 12, cycle: 10 },
        { id: 3, name: 'Water Supply', cost: 50, duration: 12, cycle: 10 },
        { id: 4, name: 'Internet', cost: 30, duration: 12, cycle: 10 },
    ],
    status: 'idle',
    error: null,
    monthlyTotal: 220,
    yearlyTotal: 220*12,
};

export const fetchContracts = createAsyncThunk('contracts/fetchContracts', async () => {
    const response = await axios.get(url);
    return response.data;
});

export const addContract = createAsyncThunk('contracts/addContract', async (contract: Contract) => {
    const response = await axios.post(url, contract);
    return response.data;
});

export const updateContract = createAsyncThunk('contracts/updateContract', async (contract: Contract) => {
    const response = await axios.put(`${url}/${contract.id}`, contract);
    return response.data;
});

export const deleteContract = createAsyncThunk('contracts/deleteContract', async (id: number) => {
    await axios.delete(`${url}/${id}`);
    return id;
});

const contractsSlice = createSlice({
    name: 'contracts',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchContracts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchContracts.fulfilled, (state, action) => {
                state.contracts = action.payload;
                state.monthlyTotal = state.contracts.reduce((total, contract) => total + contract.cost, 0);
                state.yearlyTotal = state.monthlyTotal * 12;
                state.status = 'succeeded';
            })
            .addCase(fetchContracts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch contracts';
            })
            .addCase(addContract.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(addContract.fulfilled, (state, action) => {
                state.contracts.push(action.payload);
                state.monthlyTotal += action.payload.cost;
                state.yearlyTotal = state.monthlyTotal * 12;
                state.status = 'succeeded';
            })
            .addCase(addContract.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to add contract';
            })
            .addCase(updateContract.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateContract.fulfilled, (state, action) => {
                const index = state.contracts.findIndex(c => c.id === action.payload.id);
                if (index !== -1) {
                    state.monthlyTotal -= state.contracts[index].cost;
                    state.contracts[index] = action.payload;
                    state.monthlyTotal += action.payload.cost;
                    state.yearlyTotal = state.monthlyTotal * 12;
                }
                state.status = 'succeeded';
            })
            .addCase(updateContract.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to update contract';
            })
            .addCase(deleteContract.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteContract.fulfilled, (state, action) => {
                const index = state.contracts.findIndex(c => c.id === action.payload);
                if (index !== -1) {
                    state.monthlyTotal -= state.contracts[index].cost;
                    state.contracts.splice(index, 1);
                    state.yearlyTotal = state.monthlyTotal * 12;
                }
                state.status = 'succeeded';
            })
            .addCase(deleteContract.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to delete contract';
            });
    },
});

export default contractsSlice.reducer;
export type { Contract };
