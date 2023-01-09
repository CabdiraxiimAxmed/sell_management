import { createSlice } from '@reduxjs/toolkit';

interface UserType{
    value: {
        id: number,
        name: string,
        role: string,
        username: string,
        permissions: string[],
        password: string,
        createdAt: string,
    }
}

const initialState: UserType = {
    value: {
        id: 0,
        name: '',
        role: '',
        username: '',
        password: '',
        permissions: [''],
        createdAt: '',
    }
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.value = action.payload;
        },
    },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
