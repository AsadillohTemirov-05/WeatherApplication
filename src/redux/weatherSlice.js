import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios";


const API_KEY=import.meta.env.VITE_WEATHER_API_KEY
const BASE_URL=import.meta.env.VITE_BASE_URL;


console.log(API_KEY);
console.log(BASE_URL);

export const fetchForeCastByCity = createAsyncThunk(
  "weather/fetchForecastByCity",
  async (city, thunkAPI) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=5`
      );
      return response.data;
    } catch (error) {
      console.error("API xatosi:", error);
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);


const weatherSlice=createSlice(({
    name:"weather",
    initialState:{
        forecast:{},
        status:"idle",
        error:null
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(fetchForeCastByCity.fulfilled,(state,action)=>{
            state.forecast=action.payload
        })
    }
}));

export default weatherSlice.reducer;
