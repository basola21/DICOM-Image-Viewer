import { createSlice } from "@reduxjs/toolkit";

export const currentImageSlice = createSlice({
  name: "currentImages",
  initialState: {
    data: null,
    error: null,
    transformations: {},
  },
  reducers: {
    setCurrentImage: (state, action) => {
      state.data = action.payload;
    },
    setImageError: (state, action) => {
      state.error = action.payload;
    },
    setTransformations: (state, action) => {
      state.transformations = { ...state.transformations, ...action.payload };
    },
  },
});

export const { setCurrentImage, setImageError, setTransformations } =
  currentImageSlice.actions;

export default currentImageSlice.reducer;
