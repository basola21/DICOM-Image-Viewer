import axios from "axios";

async function getCurrentImage(filename) {
  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5100";
  const url = `${baseURL}/images/${filename}`;

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
