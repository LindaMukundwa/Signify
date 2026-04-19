import "./Global.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TopNav } from "./components/shared/TopNav";
import { BottomNav } from "./components/shared/BottomNav";

import HomePage from "./pages/HomePage";
import MedicalIDPage from "./pages/MedicalIDPage";
import PhrasePadPage from "./pages/PhrasePadPage";
import FingerspellingPage from "./pages/FingerspellingPage";
import ResponderPage from "./pages/ResponderPage";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <div className="h-screen flex flex-col bg-bg overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/medical-id" element={<MedicalIDPage />} />
            <Route path="/phrases" element={<PhrasePadPage />} />
            <Route path="/fingerspell" element={<FingerspellingPage />} />
            <Route path="/responder" element={<ResponderPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}

export default App;
