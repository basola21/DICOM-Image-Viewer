import pydicom
from PIL import Image


def save_dicom_file(dicom_data, filename):
    with open(filename, "wb") as file:
        file.write(dicom_data)


def get_image_from_dicom(filepath):
    ds = pydicom.dcmread(filepath)
    return Image.fromarray(ds.pixel_array)


def apply_transformations(image, transformations):
    if "rotate" in transformations:
        image = image.rotate(int(transformations["rotate"]))
    if "zoom" in transformations:
        factor = float(transformations["zoom"])
        width, height = image.size
        image = image.resize((int(width * factor), int(height * factor)), Image.LANCZOS)
    return image
