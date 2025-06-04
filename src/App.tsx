import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppStateProvider } from "./lib/app-context";
import Dashboard from "./pages/dashboard";
import CorrectPage from "./pages/correct";

function App() {
  return (
    <AppStateProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/correct" element={<CorrectPage />} />
        </Routes>
      </Router>
    </AppStateProvider>
  );
}

export default App;