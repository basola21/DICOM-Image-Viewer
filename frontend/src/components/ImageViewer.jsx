import React, { useCallback, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as cornerstone from "cornerstone-core";
import * as cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import * as dicomParser from "dicom-parser";
import { Card, Typography, Grid, Snackbar, Button } from "@mui/material";
import {
  setCurrentImage,
  setImageError,
  setTransformations,
  resetTransformations,
  removeImage,
} from "../redux/currentImageSlice";

function ImageViewer() {
  const imageData = useSelector((state) => state.currentImage.currentImageData);
  const transformations = useSelector(
    (state) => state.currentImage.transformations,
  );
  const effects = useSelector((state) => state.currentImage.effects);
  const error = useSelector((state) => state.currentImage.currentImageError);
  const allImages = useSelector((state) => state.currentImage.allImages);
  const dispatch = useDispatch();
  const imageElement = useRef(null);

  const applyTransformations = useCallback(() => {
    if (!imageElement.current) {
      return;
    }
    const viewport = cornerstone.getViewport(imageElement.current);
    viewport.scale = transformations.zoom || 1;
    viewport.rotation = transformations.rotate || 0;
    viewport.translation = {
      x: transformations.panX || 0,
      y: transformations.panY || 0,
    };
    cornerstone.setViewport(imageElement.current, viewport);
    imageElement.current.style.filter =
      `grayscale(${effects.grayscale ? 100 : 0}%) ` +
      `brightness(${effects.brightness}%) ` +
      `contrast(${effects.contrast}%)`;
  }, [transformations, effects]);

  const loadAndDisplayImage = useCallback(() => {
    if (imageData && imageElement.current) {
      const imageId = `wadouri:http://127.0.0.1:5000/images/${encodeURIComponent(imageData.filename)}`;
      cornerstone.enable(imageElement.current);
      cornerstone
        .loadImage(imageId)
        .then((image) => {
          cornerstone.displayImage(imageElement.current, image);
          applyTransformations();
        })
        .catch((err) => {
          console.error("Error loading DICOM image: ", err);
          dispatch(
            setImageError(
              "Failed to load DICOM image. Please try again later.",
            ),
          );
        });
    }
  }, [imageData, applyTransformations, dispatch]);

  useEffect(() => {
    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
    loadAndDisplayImage();
  }, [loadAndDisplayImage]);

  const handleSelectImage = useCallback(
    (image) => {
      dispatch(setCurrentImage(image));
    },
    [dispatch],
  );

  const handleRotate = useCallback(
    (angle) => {
      const newRotation = (transformations.rotate || 0) + angle;
      dispatch(setTransformations({ ...transformations, rotate: newRotation }));
    },
    [transformations, dispatch],
  );

  const handleRemoveImage = useCallback(() => {
    dispatch(removeImage());
  }, [dispatch]);

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
          <Button onClick={() => handleRotate(45)}>Rotate Right</Button>
          <Button onClick={() => handleRotate(-45)}>Rotate Left</Button>
          <Button onClick={() => dispatch(resetTransformations())}>
            Reset
          </Button>
          <Button onClick={handleRemoveImage}>Remove Image</Button>
        </Card>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Typography variant="h6">Other Images</Typography>
        <div style={{ overflowY: "auto", maxHeight: "512px" }}>
          {allImages.map((image, index) => (
            <Card
              key={image.filename}
              raised
              style={{ cursor: "pointer", marginBottom: 8 }}
              onClick={() => handleSelectImage(image)}
            >
              <Typography variant="body1">
                DICOM Thumbnail {index + 1}
              </Typography>
            </Card>
          ))}
        </div>
      </Grid>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => dispatch(setImageError(null))}
        message={error || "Unknown error"}
      />
    </Grid>
  );
}

export default ImageViewer;
