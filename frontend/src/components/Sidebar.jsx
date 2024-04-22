import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import HomeIcon from "@mui/icons-material/Home";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { fetchUserDetails, logOut } from "../redux/authSlice";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";

import {
  deleteCollection,
  fetchImageCollections,
  postCollectionWithImages,
  setCollectionError,
} from "../redux/imageCollectionsSlice";
import { setAllImages } from "../redux/currentImageSlice";

function Sidebar() {
  const dispatch = useDispatch();
  const loggedIn = useSelector((state) => state.userAuth.isLoggedIn);
  const user = useSelector((state) => state.userAuth.user);
  const allImages = useSelector((state) => state.currentImage.allImages);
  const error = useSelector((state) => state.imageCollection.error);
  const isLoading = useSelector((state) => state.imageCollection.isLoading);
  const collections = useSelector((state) => state.imageCollection.collections);

  const [open, setOpen] = useState(false);
  const [collectionName, setCollectionName] = useState("");

  useEffect(() => {
    if (loggedIn && user.email === "") {
      dispatch(fetchUserDetails());
      dispatch(fetchImageCollections());
    }
  }, [loggedIn, user, dispatch]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCloseModel = () => {
    setOpen(false);
  };

  const handleCloseError = () => {
    dispatch(setCollectionError(null));
  };

  const handleInputChange = (event) => {
    setCollectionName(event.target.value);
  };

  const handleAddCollectionName = () => {
    if (allImages.length === 0) {
      dispatch(setCollectionError("No Images to add"));
      return;
    }
    const collectionData = {
      name: collectionName,
      images: allImages.map((image) => ({ file_path: image.filename })),
    };

    dispatch(postCollectionWithImages(collectionData));
    handleCloseModel();
  };

  const handleCollectionClick = (collection) => {
    dispatch(
      setAllImages({
        allImages: collection.images,
        currentImageData: collection.images[0],
      }),
    );
  };

  const handleDeleteCollection = (collectionId) => {
    dispatch(deleteCollection(collectionId));
  };

  return (
    <div className="flex flex-col w-64 h-full bg-white shadow-xl">
      <div className="flex items-center justify-center h-20 shadow-md bg-blue-500 hover:bg-blue-700 text-white">
        <Link to="/" className="text-lg font-semibold">
          <HomeIcon style={{ fontSize: 40 }} />
        </Link>
      </div>
      <ul className="flex flex-col p-4">
        <li className="my-2 text-center">
          {loggedIn ? (
            user.email
          ) : (
            <Link to="/auth">
              <Button variant="contained" color="primary" fullWidth>
                Login
              </Button>
            </Link>
          )}
        </li>

        {loggedIn && (
          <div>
            <li className="my-2 flex justify-between">
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                startIcon={<AddIcon />}
                className="flex-grow border-dashed border-2 border-gray-400 hover:border-gray-500"
                onClick={handleClickOpen}
              >
                Add Collection
              </Button>
            </li>
            {isLoading || collections === undefined ? (
              <p>loading...</p>
            ) : collections.length > 0 ? (
              collections.map((collection, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between my-2"
                >
                  <Button
                    className="flex-grow hover:bg-gray-100"
                    onClick={() => handleCollectionClick(collection)}
                  >
                    {collection.name}
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCollection(collection.id);
                    }}
                    startIcon={<DeleteIcon />}
                    className="ml-2 border hover:border-red-600 text-red-600 hover:text-red-700"
                  >
                    Delete
                  </Button>
                </div>
              ))
            ) : (
              ""
            )}

            <li className="my-2">
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                onClick={() => dispatch(logOut())}
              >
                Logout
              </Button>
            </li>
          </div>
        )}
      </ul>
      <Dialog
        open={open}
        onClose={handleCloseModel}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add New Collection</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To add a collection, please enter the name of the collection below.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Collection Name"
            type="text"
            fullWidth
            value={collectionName}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModel} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleAddCollectionName();
              handleCloseModel();
            }}
            color="primary"
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={error !== null}
        autoHideDuration={6000}
        onClose={handleCloseError}
      >
        <Alert
          onClose={handleCloseError}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error || "Unknown error"}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Sidebar;
