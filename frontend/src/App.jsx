import { Provider, useSelector } from "react-redux";
import { store } from "./redux/store";
import ImageUploader from "./components/ImageUploader";
import ImageViewer from "./components/ImageViewer";
import ImageControls from "./components/ImageControls";

function AppContent() {
  const file = useSelector((state) => state.currentImage.currentImageData); // Accessing the file state from imageUpload slice

  return (
    <div className="mt-20 mx-20">
      <ImageUploader />
      {file && (
        <>
          <ImageViewer />
          <ImageControls />
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />{" "}
    </Provider>
  );
}

export default App;
