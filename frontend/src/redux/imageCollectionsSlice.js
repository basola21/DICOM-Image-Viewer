import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import getAuthToken from "../utils/getAuthToken";

export function fetchImageCollections() {
  return async (dispatch) => {
    const apiURL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5100";
    const token = getAuthToken();
    dispatch(fetchCollectionsStart());
    try {
      const response = await axios.get(`${apiURL}/collections/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      dispatch(fetchCollectionsSuccess(response.data));
    } catch (error) {
      const errMsg = error.response
        ? error.response.data.message
        : "Failed to fetch collections.";
      dispatch(fetchCollectionsFailure(errMsg));
    }
  };
}

export function postCollectionWithImages(collectionDetails) {
  return async (dispatch) => {
    const apiURL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5100";
    const token = getAuthToken();
    dispatch(fetchCollectionsStart());
    try {
      const response = await axios.post(
        `${apiURL}/collections/`,
        JSON.stringify(collectionDetails),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      dispatch(addCollection(response.data));
    } catch (error) {
      const errMsg = error.response
        ? error.response.data.message
        : "Failed to post new collection with images.";
      dispatch(fetchCollectionsFailure(errMsg));
    } finally {
      dispatch(fetchCollectionsEnd());
    }
  };
}

export function deleteCollection(collectionId) {
  return async (dispatch) => {
    const apiURL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5100";
    const token = getAuthToken();
    dispatch(fetchCollectionsStart());
    try {
      await axios.delete(`${apiURL}/collections/${collectionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(removeCollection({ id: collectionId }));
    } catch (error) {
      const errMsg = error.response
        ? error.response.data.message
        : "Failed to delete collection.";
      dispatch(fetchCollectionsFailure(errMsg));
    } finally {
      dispatch(fetchCollectionsEnd());
    }
  };
}

const initialState = {
  collections: [],
  isLoading: false,
  error: null,
};

export const imageCollectionSlice = createSlice({
  name: "imageCollection",
  initialState,
  reducers: {
    fetchCollectionsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchCollectionsSuccess: (state, action) => {
      state.collections = action.payload;
      state.isLoading = false;
    },
    fetchCollectionsFailure: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    addCollection: (state, action) => {
      state.collections.push(action.payload);
    },
    removeCollection: (state, action) => {
      state.collections = state.collections.filter(
        (collection) => collection.id !== action.payload.id,
      );
    },
    clearCollections: (state) => {
      state.collections = [];
    },
    setCollectionError: (state, action) => {
      state.error = action.payload;
    },
    fetchCollectionsEnd: (state) => {
      state.isLoading = false;
    },
  },
});

export const {
  fetchCollectionsStart,
  fetchCollectionsSuccess,
  fetchCollectionsFailure,
  addCollection,
  removeCollection,
  clearCollections,
  setCollectionError,
  fetchCollectionsEnd,
} = imageCollectionSlice.actions;

export default imageCollectionSlice.reducer;
