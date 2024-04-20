import { configureStore } from "@reduxjs/toolkit";
import imageUploadReducer from "./imageUploadSlice";
import currentImagesReducer from "./currentImageSlice";
import imageAnalysisReducer from "./imageAnalysisSlice";

export const store = configureStore({
  reducer: {
    imageUpload: imageUploadReducer,
    currentImage: currentImagesReducer,
    imageAnalysis: imageAnalysisReducer,
  },
});
