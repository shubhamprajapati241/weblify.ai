import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { LandingPage } from "./pages/LandingPage";
import { BuilderPage } from "./pages/BuilderPage";
import { FileItem } from "./types";

function App() {
  const [files, setFiles] = useState<FileItem[]>([]);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout files={files} />}>
          <Route index element={<LandingPage />} />
          <Route
            path="builder"
            element={<BuilderPage files={files} setFiles={setFiles} />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
