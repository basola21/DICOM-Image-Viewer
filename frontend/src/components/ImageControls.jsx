import { useDispatch, useSelector } from "react-redux";
import {
  setTransformations,
  setEffects,
  clearImages,
  resetEffects,
} from "../redux/currentImageSlice";
import {
  Slider,
  Typography,
  Grid,
  Button,
  Switch,
  FormControlLabel,
} from "@mui/material";

function ImageControls() {
  const dispatch = useDispatch();

  const effects = useSelector((state) => state.currentImage.effects);

  const transformations = useSelector(
    (state) => state.currentImage.transformations,
  );
  const handleZoomChange = (event, newValue) => {
    dispatch(setTransformations({ zoom: newValue / 100 }));
  };

  const handlePanXChange = (event, newValue) => {
    dispatch(setTransformations({ panX: newValue }));
  };

  const handlePanYChange = (event, newValue) => {
    dispatch(setTransformations({ panY: newValue }));
  };

  const handleReset = () => {
    dispatch(clearImages());
  };
  const handleEffectChange = (effect) => (event) => {
    const value =
      effect === "grayscale" ? event.target.checked : event.target.value;
    dispatch(setEffects({ [effect]: value }));
  };

  const handleResetEffects = () => {
    dispatch(resetEffects());
  };
  return (
    <div>
      <Typography variant="h6">Image Controls</Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
          <Typography gutterBottom>Zoom</Typography>
          <Slider
            value={transformations.zoom * 100}
            onChangeCommitted={handleZoomChange}
            aria-labelledby="zoom-slider"
            valueLabelDisplay="auto"
            step={1}
            marks
            min={50}
            max={200}
          />
        </Grid>
        <Grid item xs={6}>
          <Typography gutterBottom>Pan Horizontal</Typography>
          <Slider
            value={transformations.panX}
            onChangeCommitted={handlePanXChange}
            aria-labelledby="pan-x-slider"
            valueLabelDisplay="auto"
            step={1}
            marks
            min={-100}
            max={100}
          />
        </Grid>
        <Grid item xs={6}>
          <Typography gutterBottom>Pan Vertical</Typography>
          <Slider
            value={transformations.panY}
            onChangeCommitted={handlePanYChange}
            aria-labelledby="pan-y-slider"
            valueLabelDisplay="auto"
            step={1}
            marks
            min={-100}
            max={100}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={effects.grayscale}
                onChange={handleEffectChange("grayscale")}
              />
            }
            label="Grayscale"
          />
          <Slider
            value={effects.brightness}
            onChange={handleEffectChange("brightness")}
            aria-labelledby="brightness-slider"
            valueLabelDisplay="auto"
            step={1}
            min={50}
            max={150}
            label="Brightness"
          />
          <Slider
            value={effects.contrast}
            onChange={handleEffectChange("contrast")}
            aria-labelledby="contrast-slider"
            valueLabelDisplay="auto"
            step={1}
            min={50}
            max={150}
            label="Contrast"
          />
          <Button
            variant="outlined"
            onClick={handleResetEffects}
            color="secondary"
            style={{ marginTop: "20px" }}
          >
            Reset Effects
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="outlined"
            onClick={handleReset}
            color="secondary"
            style={{ marginTop: "20px" }}
          >
            Reset All
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}

export default ImageControls;
