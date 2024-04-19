import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentImageData: null,
  currentImageError: null,
  transformations: {
    rotate: 0,
    zoom: 1,
  },
  allImages: [],
  imagesError: null,
};

export const currentImageSlice = createSlice({
  name: "currentImage",
  initialState,
  reducers: {
    setCurrentImage: (state, action) => {
      state.currentImageData = action.payload;
    },
    setImageError: (state, action) => {
      state.currentImageError = action.payload;
    },
    setTransformations: (state, action) => {
      if (action.payload.rotate !== undefined) {
        state.transformations.rotate += action.payload.rotate;
      }
      if (action.payload.zoom !== undefined) {
        state.transformations.zoom = action.payload.zoom;
      }
    },
    resetTransformations: (state) => {
      state.transformations = { rotate: 0, zoom: 1 };
    },
    addImage: (state, action) => {
      state.allImages.push(action.payload);
    },
    removeImageAndUpdateCurrent: (state, action) => {
      state.allImages = state.allImages.filter(
        (image) => image.filename !== action.payload,
      );
      const newSelectedImage = state.allImages[0] || null;
      state.currentImageData = newSelectedImage
        ? { filename: newSelectedImage.filename }
        : null;
    },
    updateImage: (state, action) => {
      const index = state.allImages.findIndex(
        (image) => image.filename === action.payload.id,
      );
      if (index !== -1) {
        state.allImages[index] = {
          ...state.allImages[index],
          ...action.payload.data,
        };
      }
    },
    clearImages: (state) => {
      state.allImages = [];
      state.imagesError = null;
      state.currentImageData = null; // Also reset the current image data
    },
  },
});

export const {
  setCurrentImage,
  setImageError,
  setTransformations,
  resetTransformations,
  addImage,
  removeImageAndUpdateCurrent,
  updateImage,
  clearImages,
} = currentImageSlice.actions;

export default currentImageSlice.reducer;
