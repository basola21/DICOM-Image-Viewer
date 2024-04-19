import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  uploadImage,
  toggleSnackbar,
  startUpload,
  imageUploadError,
} from "../redux/imageUploadSlice";
import { useDropzone } from "react-dropzone";
import { Box, Snackbar, Alert, CircularProgress } from "@mui/material";
import validateFile from "../utils/validateFileType";

function ImageUploader() {
  const dispatch = useDispatch();
  const { error, status, snackbarOpen } = useSelector(
    (state) => state.imageUpload,
  );
  const loading = status === "loading";

  const onDrop = useCallback(
    (acceptedFiles) => {
      acceptedFiles.forEach((file) => {
        const { isValid, error } = validateFile(file);
        if (!isValid) {
          dispatch(imageUploadError(error));
          return;
        }
        dispatch(startUpload());
        dispatch(uploadImage(file))
          .unwrap()
          .then(() => {
            dispatch(toggleSnackbar(false)); // Close snackbar via Redux
          })
          .catch((err) => {
            const errorMessage =
              err.response?.data?.message ||
              err.message ||
              "Error uploading file.";
            dispatch(imageUploadError(errorMessage));
          });
      });
    },
    [dispatch],
  );

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(toggleSnackbar(false));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/dicom": [".dicom", ".dcm"],
      "application/dicom": [".dicom", ".dcm"],
      "application/dcm": [".dcm"],
    },
    multiple: true,
  });

  return (
    <div {...getRootProps()} className="cursor-pointer">
      <input {...getInputProps()} />
      <Box
        sx={{
          p: 2,
          border: "2px dashed #ccc",
          borderColor: isDragActive ? "primary.main" : "grey.500",
          bgcolor: "background.paper",
          color: isDragActive ? "primary.contrastText" : "text.secondary",
          textAlign: "center",
          minHeight: "150px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {loading ? (
          <CircularProgress color="inherit" />
        ) : (
          <p className="text-base">
            {isDragActive
              ? "Drop the files here ..."
              : "Drag 'n' drop files here, or click to select files"}
          </p>
        )}
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default ImageUploader;
