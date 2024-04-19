import axios from "axios";

async function getCurrentImage(filename) {
  const url = `http://localhost:5000/images/${filename}`;

  return axios
    .get(url, { responseType: "blob" })
    .then((response) => {
      if (response.status === 200) {
        return URL.createObjectURL(response.data);
      } else {
        throw new Error("Image not found");
      }
    })
    .catch((error) => {
      console.error("Error fetching the image:", error);
      throw error;
    });
}

export default getCurrentImage;
