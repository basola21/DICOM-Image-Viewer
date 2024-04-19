import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as cornerstone from "cornerstone-core";
import * as cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import * as dicomParser from "dicom-parser";
import { Card, Typography, Grid, Snackbar } from "@mui/material";
import { setCurrentImage, setImageError } from "../redux/currentImageSlice";

function ImageViewer() {
  const imageData = useSelector((state) => state.currentImage.currentImageData);
  const transformations = useSelector(
    (state) => state.currentImage.transformations,
  );
  const error = useSelector((state) => state.currentImage.error);
  const allImages = useSelector((state) => state.currentImage.allImages);
  const dispatch = useDispatch();
  const imageElement = useRef(null);

  useEffect(() => {
    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
    return () => cornerstone.disable(imageElement.current);
  }, []);

  useEffect(() => {
    if (imageData && imageElement.current) {
      const imageId = `wadouri:http://127.0.0.1:5000/images/${encodeURIComponent(imageData.filename)}`;
      cornerstone.enable(imageElement.current);
      cornerstone
        .loadImage(imageId)
        .then((image) => {
          cornerstone.displayImage(imageElement.current, image);
          applyTransformations();
        })
        .catch((error) => {
          console.error("Error loading DICOM image: ", error);
          dispatch(
            setImageError(
              "Failed to load DICOM image. Please try again later.",
            ),
          );
        });
    }
  }, [imageData, transformations]);

  const applyTransformations = () => {
    const viewport = cornerstone.getViewport(imageElement.current);
    if (transformations.zoom) {
      viewport.scale = transformations.zoom;
    }
    if (transformations.rotate) {
      viewport.rotation = transformations.rotate;
    }
    cornerstone.setViewport(imageElement.current, viewport);
  };

  const handleSelectImage = (image) => {
    dispatch(setCurrentImage(image));
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={8}>
        <Card raised>
          <Typography variant="h6">DICOM Image Viewer</Typography>
          <div
            ref={imageElement}
            style={{ width: "512px", height: "512px" }}
            aria-label="DICOM Image Display Area"
          ></div>
        </Card>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Typography variant="h6">Other Images</Typography>
        <div style={{ overflowY: "auto", maxHeight: "512px" }}>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {allImages.map((image, index) => (
              <li key={index} style={{ marginBottom: 8 }}>
                <Card
                  raised
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSelectImage(image)}
                >
                  <Typography variant="body1">
                    DICOM Thumbnail {index + 1}
                  </Typography>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      </Grid>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => dispatch(setImageError)}
        message={error}
      />
    </Grid>
  );
}

export default ImageViewer;
