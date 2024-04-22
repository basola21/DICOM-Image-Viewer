import { configureStore } from "@reduxjs/toolkit";
import imageUploadReducer from "./imageUploadSlice";
import currentImagesReducer from "./currentImageSlice";
import imageAnalysisReducer from "./imageAnalysisSlice";
import imageCollectionsReducer from "./imageCollectionsSlice";
import authSliceReducer from "./authSlice";

export const store = configureStore({
  reducer: {
    imageUpload: imageUploadReducer,
    currentImage: currentImagesReducer,
    imageCollection: imageCollectionsReducer,
    imageAnalysis: imageAnalysisReducer,
    userAuth: authSliceReducer,
  },
});
