import { useDispatch } from "react-redux";
import { setTransformations } from "../redux/currentImageSlice";
import { resetUpload } from "../redux/imageUploadSlice"; // Import the reset action
import { Slider, Typography, Grid, Button } from "@mui/material";

function ImageControls() {
  const dispatch = useDispatch();

  const handleZoomChange = (event, newValue) => {
    dispatch(setTransformations({ zoom: newValue / 100 }));
  };

  const handleRotate = (angle) => () => {
    dispatch(setTransformations({ rotate: angle }));
  };

  const handleReset = () => {
    dispatch(resetUpload());
  };

  return (
    <div>
      <Typography variant="h6">Image Controls</Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
          <Typography gutterBottom>Zoom</Typography>
          <Slider
            defaultValue={100}
            aria-labelledby="zoom-slider"
            valueLabelDisplay="auto"
            step={10}
            marks
            min={50}
            max={200}
            onChangeCommitted={handleZoomChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography gutterBottom>Rotate</Typography>
          <Button variant="contained" onClick={handleRotate(90)}>
            Rotate 90°
          </Button>
          <Button
            variant="contained"
            onClick={handleRotate(-90)}
            style={{ marginLeft: "10px" }}
          >
            Rotate -90°
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="outlined"
            onClick={handleReset}
            color="secondary"
            style={{ marginTop: "20px" }}
          >
            Reset Upload and Transformations
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}

export default ImageControls;
