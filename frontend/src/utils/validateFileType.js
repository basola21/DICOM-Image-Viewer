export default function validateFile(file) {
  const validExtensions = [".dcm", ".dicom"];
  const extension = file.name.toLowerCase().slice(file.name.lastIndexOf("."));

  if (!validExtensions.includes(extension)) {
    return {
      isValid: false,
      error: "Unsupported file type. Please upload a DICOM file.",
    };
  }
  if (file.size > 5 * 1024 * 1024) {
    return { isValid: false, error: "File is too large. Maximum size is 5MB." };
  }
  return { isValid: true, error: "" };
}
