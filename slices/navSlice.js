import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    origin: null,
    destination: null,
    travelTimeInformation: null,
    isUserSignedIn: false,
}


export const navSlice = createSlice({
    name: 'nav',
    initialState,
    reducers: {
        setOrigin: (state, action) => {
            state.origin = action.payload;
        },
        setDestination: (state, action) => {
            state.destination = action.payload;
        },
        setTravelTimeInformation: (state, action) => {
            state.travelTimeInformation = action.payload;
        },
        setIsUserSignedIn: (state, action) => {
            state.isUserSignedIn = action.payload;
        }
    },
});

export const {setOrigin, setDestination, setTravelTimeInformation, setIsUserSignedIn} = navSlice.actions ;

//selectors
export const selectOrigin = (state) => state.nav.origin;
export const selectDestination = (state) => state.nav.destination;
export const selectTravelTimeInformation = (state) => state.nav.travelTimeInformation; 
export const selectIsUserSignedIn = (state) => state.nav.isUserSignedIn;
export default navSlice.reducer;