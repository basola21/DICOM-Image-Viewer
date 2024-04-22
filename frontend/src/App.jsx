import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import AppContent from "./AppContent";
import Auth from "./components/Auth";
import Sidebar from "./components/Sidebar";
function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="flex h-screen w-screen">
          <Sidebar />
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<AppContent />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
