import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";

const startAnalysis = createAction("imageAnalysis/startAnalysis");
const analysisSuccess = createAction("imageAnalysis/analysisSuccess");
const analysisFailure = createAction("imageAnalysis/analysisFailure");

export const analyzeImage = createAsyncThunk(
  "imageAnalysis/analyzeImage",
  async (filename, { dispatch, rejectWithValue }) => {
    dispatch(startAnalysis());
    try {
      const apiURL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5100";
      const response = await fetch(
        `${apiURL}/images/analyze/${encodeURIComponent(filename)}`,
      );
      const keypoints = await response.json();
      dispatch(analysisSuccess(keypoints));
      return keypoints;
    } catch (error) {
      dispatch(analysisFailure("Failed to analyze the image."));
      return rejectWithValue("Failed to analyze the image.");
    }
  },
);

export const imageAnalysisSlice = createSlice({
  name: "imageAnalysis",
  initialState: {
    keypoints: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    resetKeypoints: (state) => {
      state.keypoints = [];
    },
    startAnalysis: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    analysisSuccess: (state, action) => {
      state.isLoading = false;
      state.keypoints = action.payload;
      state.error = null;
    },
    analysisFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { resetKeypoints } = imageAnalysisSlice.actions;

export default imageAnalysisSlice.reducer;
