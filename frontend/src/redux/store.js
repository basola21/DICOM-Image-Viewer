import { configureStore } from "@reduxjs/toolkit";
import imageUploadReducer from "./imageUploadSlice";
import currentImagesReducer from "./currentImageSlice";

export const store = configureStore({
  reducer: {
    imageUpload: imageUploadReducer,
    currentImage: currentImagesReducer,
  },
});
