import { useDispatch, useSelector } from "react-redux";
import {
  setImageError,
  setTransformations,
  resetTransformations,
  addImage,
  updateImage,
  removeImageAndUpdateCurrent,
  clearImages,
  setImageError as setAllImagesError,
} from "../redux/currentImageSlice";
import { resetUpload } from "../redux/imageUploadSlice";
import { Slider, Typography, Grid, Button, TextField } from "@mui/material";

function ImageControls() {
  const dispatch = useDispatch();

  const handleZoomChange = (event, newValue) => {
    dispatch(setTransformations({ zoom: newValue / 100 }));
  };

  const handleRotate = (angle) => () => {
    dispatch(setTransformations({ rotate: angle }));
  };

  const handleResetTransfromations = () => {
    dispatch(resetTransformations());
  };
  const handleReset = () => {
    dispatch(resetUpload());
    dispatch(clearImages());
  };

  const handleAddImage = () => {
    const newImage = { id: Date.now(), filename: "newimage.dcm" }; // Example image object
    dispatch(addImage(newImage));
  };
  const handleRemoveImage = (filename) => {
    dispatch(removeImageAndUpdateCurrent(filename));
  };
  const handleUpdateImage = (id) => {
    const updatedInfo = { id: id, data: { filename: "updatedimage.dcm" } }; // Example update
    dispatch(updateImage(updatedInfo));
  };

  const handleError = (error) => {
    dispatch(setImageError(error));
    dispatch(setAllImagesError(error));
  };

  return (
    <div>
      <Typography variant="h6">Image Controls</Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
          <Typography gutterBottom>Zoom</Typography>
          <Slider
            onChangeCommitted={handleZoomChange}
            aria-labelledby="zoom-slider"
            valueLabelDisplay="auto"
            step={1}
            marks
            min={50}
            max={200}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography gutterBottom>Rotate</Typography>
          <Button variant="contained" onClick={handleRotate(45)}>
            Rotate 45°
          </Button>
          <Button
            variant="contained"
            onClick={handleRotate(-45)}
            style={{ marginLeft: "10px" }}
          >
            Rotate -45°
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="outlined"
            onClick={handleResetTransfromations}
            color="secondary"
            style={{ marginTop: "20px", marginRight: "10px" }}
          >
            Reset Transformations
          </Button>
          <Button
            variant="outlined"
            onClick={handleReset}
            color="secondary"
            style={{ marginTop: "20px" }}
          >
            Reset Upload and Transformations
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" onClick={handleAddImage}>
            Add Image
          </Button>
          <TextField
            id="image-id"
            label="Image ID"
            variant="outlined"
            size="small"
            style={{ marginLeft: "10px" }}
          />
          <Button
            variant="contained"
            onClick={() =>
              handleRemoveImage(document.getElementById("image-id").value)
            }
          >
            Remove Image
          </Button>
          <Button
            variant="contained"
            onClick={() =>
              handleUpdateImage(document.getElementById("image-id").value)
            }
            style={{ marginLeft: "10px" }}
          >
            Update Image
          </Button>
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="error-text"
            label="Error Message"
            variant="outlined"
            size="small"
          />
          <Button
            variant="contained"
            onClick={() =>
              handleError(document.getElementById("error-text").value)
            }
            style={{ marginLeft: "10px" }}
          >
            Set Error
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}

export default ImageControls;
