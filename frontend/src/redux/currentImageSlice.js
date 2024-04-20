import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentImageData: null,
  currentImageError: null,
  transformations: {
    rotate: 0,
    zoom: 1,
    panX: 0,
    panY: 0,
  },
  effects: {
    grayscale: false,
    brightness: 100,
    contrast: 100,
  },
  history: [],
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
      state.history.push({ ...state.transformations });
      Object.keys(action.payload).forEach((key) => {
        const newValue = action.payload[key];
        if (newValue !== undefined) {
          state.transformations[key] = newValue;
        }
      });
    },
    resetTransformations: (state) => {
      state.transformations = { rotate: 0, zoom: 1, panX: 0, panY: 0 };
    },
    setEffects: (state, action) => {
      Object.keys(action.payload).forEach((key) => {
        const newValue = action.payload[key];
        if (newValue !== undefined) {
          state.effects[key] = newValue;
        }
      });
    },
    resetEffects: (state) => {
      state.effects = { grayscale: false, brightness: 100, contrast: 100 };
    },
    undoLastTransformation: (state) => {
      if (state.history.length > 0) {
        state.transformations = state.history.pop();
      }
    },
    addImage: (state, action) => {
      state.allImages.push(action.payload);
    },
    removeImage: (state) => {
      if (state.currentImageData) {
        state.allImages = state.allImages.filter(
          (image) => image.filename !== state.currentImageData.filename,
        );
        state.currentImageData = state.allImages[0] || null;
      }
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
      state.currentImageData = null;
      state.effects = { grayscale: false, brightness: 100, contrast: 100 };
      state.history = [];
    },
  },
});

export const {
  setCurrentImage,
  setImageError,
  setTransformations,
  resetTransformations,
  setEffects,
  undoLastTransformation,
  addImage,
  removeImage,
  updateImage,
  clearImages,
  resetEffects,
} = currentImageSlice.actions;

export default currentImageSlice.reducer;
