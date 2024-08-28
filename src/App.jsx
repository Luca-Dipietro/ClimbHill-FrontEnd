import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import NavBar from "./components/NavBar/NavBar";
import Footer from "./components/Footer/Footer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage/HomePage";
import ProfilePage from "./components/ProfilePage/ProfilePage";
import MieiTorneiPage from "./components/TorneiPage/MieiTorneiPage";
import TorneiDisponibili from "./components/TorneiPage/TorneiDisponibili";
import GiochiDisponibili from "./components/GiochiPage/GiochiDisponibili";
import DettaglioSquadra from "./components/SquadrePage/DettaglioSquadra";
import TorneoDettagli from "./components/TorneiPage/TorneoDettagli";

function App() {
  return (
    <div className="App">
      <Router>
        <NavBar />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profilepage" element={<ProfilePage />} />
          <Route path="/mieitornei" element={<MieiTorneiPage />} />
          <Route path="/giochidisponibili" element={<GiochiDisponibili />} />
          <Route path="/torneidisponibili" element={<TorneiDisponibili />} />
          <Route path="/torneodettagli/:id" element={<TorneoDettagli />} />
          <Route path="/squadreutente/:squadraId" element={<DettaglioSquadra />} />
        </Routes>

        <Footer />
      </Router>
    </div>
  );
}

export default App;
