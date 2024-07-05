// /contract/contractsSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const port = 5000; // Port number of Flask API (make sure the API is running on this port, locally)
const url = `http://localhost:${port}/api/contracts`;

interface Contract {
    id: number;
    name: string;
    cost: number; // Monthly cost
    duration: number; // Duration in months
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
    monthlyTotal: 0, // Will be computed based on the contracts array
    yearlyTotal: 0, // Will be computed based on the contracts array
};

export const fetchContracts = createAsyncThunk('contracts/fetchContracts', async () => {
    const response = await axios.get(url);
    return response.data;
});

export const addContract = createAsyncThunk('contracts/addContract', async (contract: Contract) => {
    console.log("called in contract slice")
    const response = await axios.post(url, contract);
    return response.data;
});

export const updateContract = createAsyncThunk('contracts/updateContract', async (contract: Contract) => {
    console.log("red");
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
    extraReducers(builder) {
        builder
            .addCase(fetchContracts.fulfilled, (state, action) => {
                state.contracts = action.payload;
                state.monthlyTotal = state.contracts.reduce((total, contract) => total + contract.cost, 0);
                state.yearlyTotal = state.monthlyTotal * 12;
            })
            // Cases for add, update, and delete based on the API's response structure
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
export type {Contract};
