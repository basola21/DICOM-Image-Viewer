import { useSelector } from "react-redux";
import ImageUploader from "./components/ImageUploader";
import ImageViewer from "./components/ImageViewer";
import ImageControls from "./components/ImageControls";

function AppContent() {
  const file = useSelector((state) => state.currentImage.currentImageData);

  return (
    <span className="flex flex-col justify-start items-center p-10 w-5/6 space-y-6 ">
      <div className="w-full p-4 border-2 border-dashed border-gray-400 hover:border-blue-500 cursor-pointer">
        <ImageUploader />
        {file && (
          <div className="space-y-4">
            <ImageViewer />
            <ImageControls />
          </div>
        )}
      </div>
    </span>
  );
}

export default AppContent;
