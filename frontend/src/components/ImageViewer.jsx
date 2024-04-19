import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import * as cornerstone from "cornerstone-core";
import * as cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import * as dicomParser from "dicom-parser";
import { Card, Typography } from "@mui/material";

function ImageViewer() {
  const imageData = useSelector((state) => state.currentImage.data);
  const imageElement = useRef(null);

  useEffect(() => {
    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
    return cornerstone.disable(imageElement.current);
  }, []);

  useEffect(() => {
    if (imageData && imageElement.current) {
      const imageId = `wadouri:http://127.0.0.1:5000/images/${imageData.filename}`;

      cornerstone.enable(imageElement.current);

      cornerstone
        .loadImage(imageId)
        .then((image) => {
          cornerstone.displayImage(imageElement.current, image);
        })
        .catch((error) => {
          console.error("Error loading DICOM image: ", error);
        });
    }
  }, [imageData]);

  return (
    <Card>
      <Typography variant="h6">DICOM Image</Typography>
      <div ref={imageElement} style={{ width: "512px", height: "512px" }}></div>
    </Card>
  );
}

export default ImageViewer;
