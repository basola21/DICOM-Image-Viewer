import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setCurrentImage, addImage } from "./currentImageSlice";

export const uploadImage = createAsyncThunk(
  "imageUpload/uploadImage",
  async (file, { dispatch, rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post(
        "http://127.0.0.1:5000/upload/",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      dispatch(setCurrentImage(response.data));
      dispatch(addImage(response.data));
      dispatch(imageUploaded(response.data));
      return response.data;
    } catch (error) {
      dispatch(imageUploadError(error.response.data));
      return rejectWithValue(error.response.data);
    }
  },
);

export const imageUploadSlice = createSlice({
  name: "imageUpload",
  initialState: {
    file: null,
    error: null,
    status: "idle", // 'idle', 'loading', 'succeeded', 'failed'
    snackbarOpen: false,
  },
  reducers: {
    startUpload(state) {
      state.status = "loading";
      state.error = null;
      state.snackbarOpen = false;
    },
    imageUploaded(state, action) {
      state.status = "succeeded";
      state.file = action.payload;
      state.error = null;
      state.snackbarOpen = true;
    },
    imageUploadError(state, action) {
      state.status = "failed";
      state.error = action.payload;
      state.snackbarOpen = true;
    },
    toggleSnackbar(state, action) {
      state.snackbarOpen = action.payload;
    },
    resetUpload(state) {
      state.file = null;
      state.error = null;
      state.status = "idle";
      state.snackbarOpen = false;
    },
  },
});

export const {
  startUpload,
  imageUploaded,
  imageUploadError,
  toggleSnackbar,
  resetUpload,
} = imageUploadSlice.actions;

export default imageUploadSlice.reducer;
