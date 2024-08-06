import "bootstrap/dist/css/bootstrap.min.css";
import { Router, Routes } from "react-router-dom";
import "./App.css";
import NavBar from "./components/NavBar/NavBar";

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <Routes></Routes>
      </div>
    </Router>
  );
}

export default App;
