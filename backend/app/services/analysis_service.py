import cv2
import pydicom
import numpy as np


def analyze_image(file_path):
    """
    Analyze an image from a DICOM file to find keypoints using the Harris Corner Detection algorithm,
    ensuring the image is appropriately scaled for display in a 512x512 pixel canvas and ignoring black areas.

    Parameters:
    - file_path (str): The file path to the DICOM file.

    Returns:
    - list of dicts: A list of dictionaries, where each dictionary has 'x' and 'y' coordinates of a keypoint.
    """
    try:
        # Load DICOM file
        dicom_data = pydicom.dcmread(file_path)
        original_image = dicom_data.pixel_array
    except Exception as e:
        raise IOError(f"Error reading DICOM file: {e}")

    if original_image.dtype != np.uint8:
        image = np.uint8(
            (original_image - original_image.min())
            / (original_image.max() - original_image.min())
            * 255
        )
    else:
        image = original_image

    image_resized = cv2.resize(image, (512, 512), interpolation=cv2.INTER_AREA)

    gray = (
        cv2.cvtColor(image_resized, cv2.COLOR_BGR2GRAY)
        if len(image_resized.shape) == 3
        else image_resized
    )

    mask = gray > 0  # Change 0 to a threshold if not pure black

    gray = np.float32(gray)
    gray_masked = gray * mask  # Apply mask

    dst = cv2.cornerHarris(gray_masked, blockSize=2, ksize=3, k=0.04)

    dst = cv2.dilate(dst, None)

    thresh = 0.01 * dst.max()
    keypoints = np.where(dst > thresh)

    scale_x = original_image.shape[1] / 512
    scale_y = original_image.shape[0] / 512
    keypoints_list = [
        {"x": int(x * scale_x), "y": int(y * scale_y)} for y, x in zip(*keypoints)
    ]

    return keypoints_list
